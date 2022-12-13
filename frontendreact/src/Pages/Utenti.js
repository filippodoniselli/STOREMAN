import '../Styles/Tables.css';
import $ from 'jquery'
import React from 'react';

class Utenti extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            utente: props.utente,
            users: [],
            privilegi: [],
            addVisible: false,
            inEdit: -1,
            edRow: { username: "", password: "", subdate: "" }
        }
        this.getUsers = this.getUsers.bind(this);
        this.changeVisibilisty = this.changeVisibilisty.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.addUsers = this.addUsers.bind(this);
        this.Remove = this.Remove.bind(this);
        this.editUser = this.editUser.bind(this);
        this.editPass = this.editPass.bind(this);
        this.getPrivilegi = this.getPrivilegi.bind(this);
        this.searchInTable = this.searchInTable.bind(this)
    }

    componentDidMount() {
        if (this.state.privilegi.length == 0) {
            this.getUsers();
            this.getPrivilegi();
        }
    }

    async getPrivilegi() {
        let result = await fetch("https://localhost:5001/Utenti/GetPrivilegi", {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "http://localhost:3000",
            }
        }).then(res => res.json());
        this.setState({ privilegi: result });
    }

    async getUsers() {
        let result = await fetch("https://localhost:5001/Utenti/All", {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "http://localhost:3000",
            }
        }).then(res => res.json());
        if (result.length < 2) {
            this.setState({ users: [], addVisible: false, inEdit: -1 });
            $(".alert").remove();
            $('<div class="alert alert-danger alert-dismissible fade show align-items-center alert-footer" role="alert"><div>Nessun dato trovato</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>').appendTo(".App");
        } else {
            this.setState({ users: result, addVisible: false, inEdit: -1 });
        }
    }

    changeVisibilisty() {
        $(".alert").remove();
        this.setState({ users: this.state.users, addVisible: true, inEdit: -1 });
    }

    render() {
        return (
            <div className="container">
                <div id='App-Body' >
                    <div className='commands'>
                        <button className="btn btn-primary opts" id="load" onClick={this.getUsers}><i className="bi bi-arrow-counterclockwise" />  Aggiorna  </button>
                        <button className="btn btn-success opts" id="add" onClick={this.changeVisibilisty}><i className="bi bi-plus-circle"></i>  Aggiungi  </button>
                    </div>
                    <this.Table utenti={this.state.users} visible={this.state.addVisible} inEdit={this.state.inEdit} />
                </div>
            </div>
        )
    }

    Table = (props) => {
        return (
            <div id="grid">
                <div class="form-outline mb-4">
                    <input type="text" class="form-control" id="datatable-search-input" autoComplete="off"  placeholder="Cerca" onChange={this.searchInTable} />
                </div>
                <this.Header presente={props.utenti.length > 0 || props.visible} />
                {props.utenti.map(element => {
                    if (this.state.inEdit != element.id && element.id != this.state.utente) {
                        return (
                            <div className='row' key={element.id}>
                                <div className='col-2 gridCell'>
                                    <div className="btn-group" role="group">
                                        <button type="button" className="btn btn-danger" onClick={() => this.Remove(element.id)}><i className="bi bi-trash-fill"></i></button>
                                        <button type="button" className="btn btn-primary" onClick={() => this.editRow(element)}><i className="bi bi-pencil-square"></i></button>
                                    </div>
                                </div>
                                <div className='col gridCell'>{element.username}</div>
                                <div className='col gridCell'>{element.password}</div>
                                <div className='col gridCell'>{element.privilegiNavigation.descrizione}</div>
                                <div className='col gridCell'>{new Date(element.data).toLocaleDateString('en-GB')}</div>
                            </div>
                        )
                    }
                    else if (element.id != this.state.utente) {
                        return (
                            <div className='row' key={element.id}>
                                <div className='col-2 gridCell'>
                                    <div className="btn-group" role="group">
                                        <button type="button" className="btn btn-danger" onClick={() => this.setState({ inEdit: -1 })}><i className="bi bi-x-circle"></i></button>
                                        <button type="button" className="btn btn-success" onClick={() => this.saveChanges(element.id)}><i className="bi bi-check2-circle"></i></button>
                                    </div>
                                </div>
                                <div className='col gridCell'><input autoComplete="off" type="text" className="form-control" id='edUser' value={this.state.edRow.username} onChange={this.editUser} /></div>
                                <div className='col gridCell'><input autoComplete="off" type="text" className="form-control" id="edPwd" value={this.state.edRow.password} onChange={this.editPass} /></div>
                                <select id={"select" + element.id} defaultValue={element.privilegi} className="form-select col gridCell" aria-label="Privilegi">
                                    {this.state.privilegi.map(x => {
                                        return (<option value={x.id}>{x.descrizione}</option>)
                                    })}
                                </select>
                                <div className='col gridCell'>{this.state.edRow.subdate}</div>
                            </div>
                        )
                    }
                })}
                <this.Adder visible={props.visible} />
            </div>
        );
    }

    searchInTable(e) {
        var value = e.target.value.toLowerCase()
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
                    <div className="col-2" />
                    <div className="col">Username</div>
                    <div className="col">Password</div>
                    <div className='col'>Privilegi</div>
                    <div className="col">Data Iscrizione</div>
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
                    <div className='col gridCell'><input autoComplete="off" type="text" className="form-control" id='userN' /></div>
                    <div className='col gridCell'><input autoComplete="off" type="text" className="form-control" id="pwd" /></div>
                    <select id="adderSelect" className="form-select col gridCell" aria-label="Privilegi">
                        <option value="1">Amministratore</option>
                        <option value="2">Gestore</option>
                        <option value="3">Magazziniere</option>
                    </select>
                    <div className='col gridCell'></div>
                </div>
            )
        }
    }

    editUser(event) {
        this.setState({ edRow: { username: event.target.value, password: this.state.edRow.password, subdate: this.state.edRow.subdate } });
    }

    editPass(event) {
        this.setState({ edRow: { username: this.state.edRow.username, password: event.target.value, subdate: this.state.edRow.subdate } });
    }

    async Remove(id) {
        let result = await fetch("https://localhost:5001/Utenti/Remove/", {
            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            body: JSON.stringify({
                id: id
            }),
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
        let result = await fetch("https://localhost:5001/Utenti/Edit/", {
            method: "PATCH", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            body: JSON.stringify({
                id: id,
                username: this.state.edRow.username,
                password: this.state.edRow.password,
                creatore: this.state.utente,
                privilegi: $("#select" + id).val()
            }),
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
        this.setState({ users: this.state.users, addVisible: false, inEdit: -1 });
        $("#load").trigger("click");
    }

    async addUsers() {
        let result = await fetch("https://localhost:5001/Utenti/Add/", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            body: JSON.stringify({
                    username: $("#userN").val(),
                    password: $("#pwd").val(),
                    creatore: this.state.utente,
                    privilegi: $("#adderSelect").val()
            }),
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
        $("#load").trigger("click");
    }

    editRow(element) {
        $(".alert").remove();
        this.setState({ addVisible: false, inEdit: element.id, edRow: { username: element.username, password: element.password, subdate: new Date(element.data).toLocaleDateString() } });
    }

}

export default Utenti