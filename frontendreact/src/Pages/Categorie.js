import '../Styles/Tables.css';
import $ from 'jquery'
import React from 'react';

class Categorie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            utente: this.props.utente,
            categories: [],
            addVisible: false,
            inEdit: -1,
            edRow: { nome: "", data: "" }
        }
        this.getCategorie = this.getCategorie.bind(this);
        this.changeVisibilisty = this.changeVisibilisty.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.addCate = this.addCate.bind(this);
        this.Remove = this.Remove.bind(this);
        this.editNome = this.editNome.bind(this);
    }

    componentDidMount() {
        if (this.state.categories.length == 0) {
            this.getCategorie();
        }
    }

    async getCategorie() {
        let result = await fetch("http://localhost:4000/Categorie/GetCategorie/", {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "http://localhost:3000",
            }
        }).then(res => res.json());
        if (result.length == 0) {
            this.setState({ categories: [], addVisible: false, inEdit: -1 });
            $(".alert").remove();
            $('<div class="alert alert-danger alert-dismissible fade show align-items-center alert-footer" role="alert"><div>Nessun dato trovato</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>').appendTo(".App");
        } else {
            this.setState({ categories: result, addVisible: false, inEdit: -1 });
        }
    }

    changeVisibilisty() {
        $(".alert").remove();
        this.setState({ categories: this.state.categories, addVisible: true, inEdit: -1 });
    }

    render() {
        return (
            <div className="container">
                <div id='App-Body' >
                    <div className='commands'>
                        <button className="btn btn-primary opts" id="load" onClick={this.getCategorie}><i className="bi bi-arrow-counterclockwise" />  Aggiorna  </button>
                        <button className="btn btn-success opts" id="add" onClick={this.changeVisibilisty}><i className="bi bi-plus-circle"></i>  Aggiungi  </button>
                    </div>
                    <this.Table categorie={this.state.categories} visible={this.state.addVisible} inEdit={this.state.inEdit} />
                </div>
            </div>
        )
    }

    Table = (props) => {
        return (
            <div id="grid">
                <this.Header presente={props.categorie.length > 0 || props.visible} />
                {props.categorie.map(element => {
                    if (this.state.inEdit != element.id) {
                        return (
                            <div className='row' key={element.id}>
                                <div className='col-2 gridCell'>
                                    <div className="btn-group" role="group">
                                        <button type="button" className="btn btn-danger" onClick={() => this.Remove(element.id)}><i className="bi bi-trash-fill"></i></button>
                                        <button type="button" className="btn btn-primary" onClick={() => this.editRow(element)}><i className="bi bi-pencil-square"></i></button>
                                    </div>
                                </div>
                                <div className='col gridCell'>{element.nome}</div>
                                <div className='col gridCell'>{new Date(element.data).toLocaleDateString('en-GB')}</div>
                            </div>
                        )
                    }
                    else {
                        return (
                            <div className='row' key={element.id}>
                                <div className='col-2 gridCell'>
                                    <div className="btn-group" role="group">
                                        <button type="button" className="btn btn-danger" onClick={() => this.setState({ inEdit: -1 })}><i className="bi bi-x-circle"></i></button>
                                        <button type="button" className="btn btn-success" onClick={() => this.saveChanges(element.id)}><i className="bi bi-check2-circle"></i></button>
                                    </div>
                                </div>
                                <div className='col gridCell'><input autoComplete="off" type="text" className="form-control" id='edNome' value={this.state.edRow.nome} onChange={this.editNome} /></div>
                                <div className='col gridCell'>{this.state.edRow.data}</div>
                            </div>
                        )
                    }
                })}
                <this.Adder visible={props.visible} />
            </div>
        );
    }

    Header = (props) => {
        if (props.presente) {
            return (
                <div className='row' id="gridHead" key={0}>
                    <div className="col-2" />
                    <div className="col">Nome</div>
                    <div className="col">Data</div>
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
                            <button type="button" className="btn btn-success" onClick={() => this.addCate()}><i className="bi bi-upload"></i></button>
                        </div>
                    </div>
                    <div className='col gridCell'><input autoComplete="off" type="text" className="form-control" id='nomeAdd' /></div>
                    <div className='col gridCell'></div>
                </div>
            )
        }
    }

    editNome(event) {
        this.setState({ edRow: { nome: event.target.value, data: this.state.edRow.data } });
    }

    async Remove(id) {
        let result = await fetch("http://localhost:4000/Categorie/Remove/?parameters=" + id, {
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
        let result = await fetch("http://localhost:4000/Categorie/Edit/?parameters=" + this.state.utente + "|" + this.state.edRow.nome + "|" + id, {
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
        this.setState({ categories: this.state.categories, addVisible: false, inEdit: -1 });
        $("#load").trigger("click");
    }

    async addCate() {
        let result = await fetch("http://localhost:4000/Categorie/Add/?parameters=" + this.state.utente + "|" + $("#nomeAdd").val(), {
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
        this.setState({ categories: this.state.categories, addVisible: false, inEdit: -1 });
        $("#load").trigger("click");
    }

    editRow(element) {
        $(".alert").remove();
        this.setState({ addVisible: false, inEdit: element.id, edRow: { nome: element.nome, data: new Date(element.data).toLocaleDateString() } });
    }

}

export default Categorie