import '../Styles/Tables.css';
import $, { each } from 'jquery'
import React from 'react';

class Magazzino extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            utente: props.utente,
            tabella: props.tabella,
            prodotti: [],
            categorie: [],
            privilegi: props.privilegi,
            addVisible: false,
            inEdit: -1,
            edRow: { nome: "", descrizione: "", prezzo: 0, quantità: 0, categoria: props.tabella }
        }
        this.getProducts = this.getProducts.bind(this)
        this.changeVisibilisty = this.changeVisibilisty.bind(this)
        this.saveChanges = this.saveChanges.bind(this)
        this.addUsers = this.addUsers.bind(this)
        this.Remove = this.Remove.bind(this)
        this.editNome = this.editNome.bind(this)
        this.editDesc = this.editDesc.bind(this)
        this.editPrez = this.editPrez.bind(this)
        this.editQuan = this.editQuan.bind(this)
        this.getCategorie = this.getCategorie.bind(this)
        this.searchInTable = this.searchInTable.bind(this)
    }

    componentDidMount() {
        if (this.state.categorie.length == 0) {
            this.getCategorie();
            this.getProducts();
        }
    }

    async getCategorie() {
        let result = await fetch("https://localhost:5001/Categorie/GetCategorie/", {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "http://localhost:3000",
            }
        }).then(res => res.json());
        this.setState({ categorie: result });
    }

    async getProducts() {
        let result = await fetch("https://localhost:5001/Prodotti/GetProdotti/?parameters=" + this.state.tabella, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "http://localhost:3000",
            }
        }).then(res => res.json());
        if (result.length == 0) {
            this.setState({ prodotti: [], addVisible: false, inEdit: -1 });
            $(".alert").remove();
            $('<div class="alert alert-danger alert-dismissible fade show align-items-center alert-footer" role="alert"><div>Nessun dato trovato</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>').appendTo(".App");
        } else {
            this.setState({ prodotti: result, addVisible: false, inEdit: -1 });
        }
    }

    changeVisibilisty() {
        $(".alert").remove();
        this.setState({ prodotti: this.state.prodotti, addVisible: true, inEdit: -1 });
    }

    render() {
        return (
            <div className="container">
                <div id='App-Body' >
                    <div className='commands'>
                        <button className="btn btn-primary opts" id="load" onClick={this.getProducts}><i className="bi bi-arrow-counterclockwise" />  Aggiorna  </button>
                        {
                            this.state.privilegi == 1 &&
                            <button className="btn btn-success opts" id="add" onClick={this.changeVisibilisty}><i className="bi bi-plus-circle"></i>  Aggiungi  </button>
                        }
                    </div>
                    <this.Table prodotti={this.state.prodotti} visible={this.state.addVisible} inEdit={this.state.inEdit} />
                </div>
            </div>
        )
    }

    Table = (props) => {
        return (
            <div id="grid">
                <div class="form-outline mb-4">
                    <input type="text" class="form-control" id="datatable-search-input" placeholder="Cerca" onChange={this.searchInTable} />
                </div>
                <this.Header presente={props.prodotti.length > 0 || props.visible} />
                {props.prodotti.map(element => {
                    if (this.state.inEdit != element.id) {
                        return (
                            <div className='row' key={element.id}>
                                {
                                    this.state.privilegi != 3 &&
                                    <div className='col-2 gridCell'>
                                        <div className="btn-group" role="group">
                                            {this.state.privilegi == 1 &&
                                                <button type="button" className="btn btn-danger" onClick={() => this.Remove(element.id)}><i className="bi bi-trash-fill"></i></button>
                                            }
                                            <button type="button" className="btn btn-primary" onClick={() => this.editRow(element)}><i className="bi bi-pencil-square"></i></button>
                                        </div>
                                    </div>
                                }
                                <div className='col gridCell'>{element.nome}</div>
                                <div className='col gridCell'>{element.descrizione}</div>
                                {
                                    this.state.tabella == "All" &&
                                    <div className='col gridCell'>{element.categoriaNavigation.nome}</div>
                                }
                                <div className='col-1 gridCell'>{element.prezzo}</div>
                                <div className='col-1 gridCell'>
                                    {
                                        element.quantità == 0 &&
                                        <span class="badge text-bg-danger" style={{ margin: "3px" }}>{element.quantità}</span>
                                    }
                                    {
                                        element.quantità != 0 &&
                                        <div>{ element.quantità }</div>
                                    }
                                </div>
                            </div>
                        )
                    }
                    else {
                        if (this.state.privilegi == 1) {
                            return (
                                <div className='row' key={element.id}>
                                    <div className='col-2 gridCell'>
                                        <div className="btn-group" role="group">
                                            <button type="button" className="btn btn-danger" onClick={() => this.setState({ inEdit: -1 })}><i className="bi bi-x-circle"></i></button>
                                            <button type="button" className="btn btn-success" onClick={() => this.saveChanges(element.id)}><i className="bi bi-check2-circle"></i></button>
                                        </div>
                                    </div>
                                    <div className='col gridCell'><input autoComplete="off" type="text" className="form-control" id='edNome' value={this.state.edRow.nome} onChange={this.editNome} /></div>
                                    <div className='col gridCell'><input autoComplete="off" type="text" className="form-control" id="edDesc" value={this.state.edRow.descrizione} onChange={this.editDesc} /></div>
                                    {
                                        this.state.tabella == "All" &&
                                        <select id={"select" + element.id} defaultValue={element.categoriaNavigation.nome} className="form-select col gridCell" aria-label="Categoria">
                                            {
                                                this.state.categorie.map(x => {
                                                    return (<option key={x.id} value={x.nome}>{x.nome}</option>)
                                                }
                                                )
                                            }
                                        </select>
                                    }
                                    <div className='col-1 gridCell'><input autoComplete="off" type="number" step=".01" min="0" className="form-control" id='edNome' value={this.state.edRow.prezzo} onChange={this.editPrez} /></div>
                                    <div className='col-1 gridCell'><input autoComplete="off" type="number" min="0" className="form-control" id="edDesc" value={this.state.edRow.quantità} onChange={this.editQuan} /></div>
                                </div>
                            )
                        }
                        else if (this.state.privilegi == 2) {
                            return (
                                <div className='row' key={element.id}>
                                    <div className='col-2 gridCell'>
                                        <div className="btn-group" role="group">
                                            <button type="button" className="btn btn-danger" onClick={() => this.setState({ inEdit: -1 })}><i className="bi bi-x-circle"></i></button>
                                            <button type="button" className="btn btn-success" onClick={() => this.saveChanges(element.id)}><i className="bi bi-check2-circle"></i></button>
                                        </div>
                                    </div>
                                    <div className='col gridCell'>{this.state.edRow.nome}</div>
                                    <div className='col gridCell'>{this.state.edRow.descrizione}</div>
                                    {
                                        this.state.tabella == "All" &&
                                        <div className='col gridCell'>{this.state.edRow.categoria}</div>
                                    }
                                    <div className='col-1 gridCell'>{this.state.edRow.prezzo}</div>
                                    <div className='col-1 gridCell'><input autoComplete="off" type="number" min="0" className="form-control" id="edDesc" value={this.state.edRow.quantità} onChange={this.editQuan} /></div>
                                </div>
                            )
                        }
                    }
                })}
                <this.Adder visible={props.visible} />
            </div>
        );
    }

    searchInTable(e) {
        var value = e.target.value
        $("#grid .row").filter(function () {
            if (this.id != "gridHead") {
                var i = 1;
                var vedi = false
                for (i = 1; i < this.children.length; i++) {
                    vedi = this.children[i].textContent.toLowerCase().includes(value)
                    if (vedi) {
                        this.style.display = ""
                        break
                    }
                }
                if (!vedi) {
                    this.style.display = "none"
                }
            }
        });
    }

    Header = (props) => {
        if (props.presente) {
            return (
                <div className='row' id="gridHead" key={0}>
                    {
                        this.state.privilegi != 3 &&
                        <div className="col-2" />
                    }
                    <div className="col">Nome</div>
                    <div className="col">Descrizione</div>
                    {
                        this.state.tabella == "All" &&
                        <div className='col'>Categoria</div>
                    }
                    <div className='col-1'>€/Pz</div>
                    <div className="col-1">Qt</div>
                </div>
            )
        }
    }

    Adder = (props) => {
        if (!props.visible) {
            return ("")
        }
        else {
            return (
                <div className='row' key="value">
                    <div className='col-2 gridCell'>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-danger" onClick={() => this.setState({ addVisible: false })}><i className="bi bi-x-circle"></i></button>
                            <button type="button" className="btn btn-success" onClick={() => this.addUsers()}><i className="bi bi-upload"></i></button>
                        </div>
                    </div>
                    <div className='col gridCell'><input autoComplete="off" type="text" className="form-control" id='nomeAdd' /></div>
                    <div className='col gridCell'><input autoComplete="off" type="text" className="form-control" id="descAdd" /></div>
                    {
                        this.state.tabella == "All" &&
                        <select id="adderSelect" className="form-select col gridCell" aria-label="Categoria">
                            {
                                this.state.categorie.map(x => {
                                    return (<option value={x.nome}>{x.nome}</option>)
                                }
                                )
                            }
                        </select>
                    }
                    <div className='col-1 gridCell'><input autoComplete="off" type="number" step=".01" min="0" className="form-control" id='prezAdd' /></div>
                    <div className='col-1 gridCell'><input autoComplete="off" type="number" min="0" className="form-control" id="quanAdd" /></div>
                </div>
            )
        }
    }

    editNome(event) {
        this.setState({ edRow: { nome: event.target.value, descrizione: this.state.edRow.descrizione, categoria: this.state.edRow.categoria, prezzo: this.state.edRow.prezzo, quantità: this.state.edRow.quantità } });
    }

    editDesc(event) {
        this.setState({ edRow: { nome: this.state.edRow.nome, descrizione: event.target.value, categoria: this.state.edRow.categoria, prezzo: this.state.edRow.prezzo, quantità: this.state.edRow.quantità } });
    }

    editPrez(event) {
        this.setState({ edRow: { nome: this.state.edRow.nome, descrizione: this.state.edRow.descrizione, categoria: this.state.edRow.categoria, prezzo: event.target.value, quantità: this.state.edRow.quantità } });
    }

    editQuan(event) {
        this.setState({ edRow: { nome: this.state.edRow.nome, descrizione: this.state.edRow.descrizione, categoria: this.state.edRow.categoria, prezzo: this.state.edRow.prezzo, quantità: event.target.value } });
    }


    async Remove(id) {
        let result = await fetch("https://localhost:5001/Prodotti/Remove/?parameters=" + id, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "text/plain",
                'Accept': 'text/plain',
                "Access-Control-Allow-Origin": "http://localhost:3000",
            }
        }).then(res => res.text());
        $(".alert").remove();
        if (result.includes("Rimosso")) {
            $('<div class="alert alert-success alert-dismissible fade show align-items-center alert-footer" role="alert"><div>' + result + '</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>').appendTo(".App");
        } else {
            $('<div class="alert alert-danger alert-dismissible fade show align-items-center alert-footer" role="alert"><div>' + result + '</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>').appendTo(".App");
        }
        $("#load").trigger("click");
    }

    async saveChanges(id) {
        var cate
        if (this.state.privilegi == 1) {
            cate = this.state.tabella == "All" ? $("#select" + id).val() : this.state.tabella
        } else {
            cate = this.state.edRow.categoria
        }
        let result = await fetch("https://localhost:5001/Prodotti/Edit/?parameters=" + this.state.utente + "|" + id + "|" + this.state.edRow.nome + "|" + this.state.edRow.descrizione + "|" + cate + "|" + this.state.edRow.prezzo + "|" + this.state.edRow.quantità, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "text/plain",
                'Accept': 'text/plain',
                "Access-Control-Allow-Origin": "http://localhost:3000",
            }
        }).then(res => res.text());
        $(".alert").remove();
        if (result.includes("Modificato")) {
            $('<div class="alert alert-success alert-dismissible fade show align-items-center alert-footer" role="alert"><div>' + result + '</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>').appendTo(".App");
        } else {
            $('<div class="alert alert-danger alert-dismissible fade show align-items-center alert-footer" role="alert"><div>' + result + '</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>').appendTo(".App");
        }
        this.setState({ users: this.state.prodotti, addVisible: false, inEdit: -1 });
        $("#load").trigger("click");
    }

    async addUsers() {
        var cate = this.state.tabella == "All" ? $("#adderSelect").val() : this.state.tabella
        let result = await fetch("https://localhost:5001/Prodotti/Add/?parameters=" + this.state.utente + "|" + $("#nomeAdd").val() + "|" + $("#descAdd").val() + "|" + cate + "|" + $("#prezAdd").val() + "|" + $("#quanAdd").val(), {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "text/plain",
                'Accept': 'text/plain',
                "Access-Control-Allow-Origin": "http://localhost:3000",
            }
        }).then(res => res.text());
        $(".alert").remove();
        if (result.includes("Aggiunto")) {
            $('<div class="alert alert-success alert-dismissible fade show align-items-center alert-footer" role="alert"><div>' + result + '</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>').appendTo(".App");
        } else {
            $('<div class="alert alert-danger alert-dismissible fade show align-items-center alert-footer" role="alert"><div>' + result + '</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>').appendTo(".App");
        }
        this.setState({ users: this.state.prodotti, addVisible: false, inEdit: -1 });
        $("#load").trigger("click");
    }

    editRow(element) {
        $(".alert").remove();
        this.setState({ addVisible: false, inEdit: element.id, edRow: { nome: element.nome, descrizione: element.descrizione, categoria: element.categoriaNavigation.nome, prezzo: element.prezzo, quantità: element.quantità } });
    }

}

export default Magazzino