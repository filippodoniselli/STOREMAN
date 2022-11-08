import '../Styles/App.css';
import $ from 'jquery'
import React from 'react';
import Utenti from './Utenti';
import Magazzino from './Magazzino';
import Categorie from './Categorie';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: "Login",
            user: { username: "", password: "", id: 0 },
            privilegi: 0,
            categorie: [],
            tabella: null,
        }
        this.checkUser = this.checkUser.bind(this);
        this.insertPass = this.insertPass.bind(this);
        this.insertUten = this.insertUten.bind(this);
        this.TitleClick = this.TitleClick.bind(this);
        this.enterBtn = this.enterBtn.bind(this);
        this.retrieveCategorie = this.retrieveCategorie.bind(this)
        this.setFirstUser = this.setFirstUser.bind(this)
    }

    componentDidMount() {
        this.retrieveCategorie();
    }

    componentDidUpdate() {
        $(".alert").remove();
    }

    async retrieveCategorie() {
        let result = await fetch("https://localhost:5001/Categorie/GetCategorieNotNull/", {
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

    TitleClick() {
        if (this.state.privilegi != 0) {
            this.setState({ active: "Home" });
        }
        else {
            this.setState({ active: "Login" });
        }
    }

    render() {
        return (
            <div className="App">
                <div className='top-bar'>
                    <nav className="navbar">
                        <header>
                            <h2>
                                <i className="bi bi-box-seam-fill"></i>
                                <a className='title-main' onClick={this.TitleClick}>StoreMan</a>
                            </h2>
                        </header>
                    </nav>
                    <nav className='navbar'>
                        {
                            this.state.privilegi > 0 &&
                            <div>
                                <a className='title' href="#" id="home-cmd" onClick={() => this.setState({ active: "Home" })}>Home</a>
                            </div>
                        }
                        {
                            this.state.privilegi > 0 &&
                            <div className='dropdown'>
                                <a className='title dropdown-toggle' role="button" href="#" id="home-cmd" data-bs-toggle="dropdown" aria-expanded="false" onClick={this.retrieveCategorie}>Magazzino</a>
                                <ul className="dropdown-menu adjustment">
                                    <li key={0}><a className="dropdown-item" href="#" onClick={() => this.setState({ active: "Prodotti0", tabella: "All" })}>Tutti i prodotti</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    {
                                        this.state.categorie.map(element =>
                                            <li key={element.id}>
                                                <a className="dropdown-item" href="#" onClick={() => this.setState({ active: "Prodotti" + element.id, tabella: element.nome })}>{element.nome}
                                                {
                                                    (this.state.privilegi != 3 && element.quantity > 0) &&
                                                        <span class="badge text-bg-danger" style={{ margin: "3px" }}>{element.quantity}</span>
                                                }
                                                </a>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        }
                        {
                            this.state.privilegi == 1 &&
                            <div>
                                <a className='title' href="#" onClick={() => this.setState({ active: "Categorie" })}>Categorie</a>
                                <a className='title' href="#" onClick={() => this.setState({ active: "Utenti" })}>Utenti</a>
                            </div>
                        }
                    </nav>
                </div>
                {
                    (this.state.active == "Login") &&
                    <this.Login />
                }
                {
                    this.state.active == "Utenti" &&
                    <Utenti utente={this.state.user.id} />
                }
                {
                    this.state.active.includes("Prodotti") &&
                    //<TestMag tabella={this.state.tabella} utente={this.state.user.id} privilegi={this.state.privilegi}/>
                    <Magazzino tabella={this.state.tabella} utente={this.state.user.id} privilegi={this.state.privilegi} key={this.state.tabella} />
                }
                {
                    this.state.active == "Categorie" &&
                    <Categorie utente={this.state.user.id} />
                }
                {
                    (this.state.active == "Home"  && this.state.user.id != 1) &&
                    <this.Welcome />
                }
                {
                    (this.state.active == "Home" && this.state.user.id == 1) &&
                    <this.FirstAccess />
                }
            </div>
        )
    }

    FirstAccess = (props) => {
        return (
            <div className="card login-card">
                <div className="card-header">
                    <i className="bi bi-person-circle"></i>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <input autoComplete="off" type="text" className="form-control" id="firstUser" placeholder="Username" />
                    </div>
                    <div className="mb-3" id="passBox">
                        <input autoComplete="off" type="password" className="form-control" id="firstPass" placeholder="Password" />
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-success log-btn" onClick={this.setFirstUser}><h5>Imposta credenziali</h5></button>
                    </div>
                </div>
            </div>
        )
    }

    async setFirstUser() {
        let resultAdd = await fetch("https://localhost:5001/Utenti/Add/?parameters=" + "2|" + $("#firstUser").val() + "|" + $("#firstPass").val() + "|1", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "text/plain",
                'Accept': 'text/plain',
                "Access-Control-Allow-Origin": "http://localhost:3000",
            }
        }).then(res => res.text());
        if (resultAdd.includes("Aggiunto")) {
            let resultEdit = await fetch("https://localhost:5001/Utenti/Edit/?parameters=" + "1|Admin|Segretissimo|1|1", {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "text/plain",
                    'Accept': 'text/plain',
                    "Access-Control-Allow-Origin": "http://localhost:3000",
                }
            }).then(res => res.text());
            if (resultEdit.includes("Modificato")) {
                let resultCheck = await fetch("https://localhost:5001/Utenti/Check/?parameters=" + $("#firstUser").val() + "|" + $("#firstPass").val(), {
                    method: "GET", // *GET, POST, PUT, DELETE, etc.
                    credentials: "same-origin", // include, *same-origin, omit
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': 'application/json',
                        "Access-Control-Allow-Origin": "http://localhost:3000",
                    }
                }).then(res => res.json());
                this.setState({ privilegi: resultCheck.privilegi, active: "Home", user: { username: $("#firstUser").val(), password: $("#firstPass").val(), id: resultCheck.id } });
            }
            else {
                $("#passBox").append('<div class="mb-3"><p class="loginError">' + resultEdit + '</p></div>');
            }
        } else {
            $("#passBox").append('<div class="mb-3"><p class="loginError">' + resultAdd +'</p></div>');
        }
    }

    Login = (props) => {
        return (
            <div className="card login-card">
                <div className="card-header">
                    <i className="bi bi-person-circle"></i>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <input autoComplete="off" type="text" className="form-control" id="LogUser" placeholder="Username" value={this.state.user.username} onChange={this.insertUten} />
                    </div>
                    <div className="mb-3" id="passBox">
                        <input autoComplete="off" type="password" className="form-control" id="LogPass" placeholder="Password" value={this.state.user.password} onChange={this.insertPass} onKeyDown={this.enterBtn} />
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-success log-btn" onClick={this.checkUser}><h5>Accedi</h5></button>
                    </div>
                </div>
            </div>
        )
    }


    enterBtn(event) {
        if (event.key === "Enter") {
            $(".log-btn").trigger("click");
        }
    }

    insertPass(event) {
        this.setState({ user: { username: this.state.user.username, password: event.target.value, id: this.state.user.id } });
    }

    insertUten(event) {
        this.setState({ user: { username: event.target.value, password: this.state.user.password, id: this.state.user.id } });
    }

    async checkUser() {
        $(".loginError").remove();
        let result = await fetch("https://localhost:5001/Utenti/Check/?parameters=" + this.state.user.username + "|" + this.state.user.password, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "http://localhost:3000",
            }
        }).then(res => res.json());
        if (result.id == 0) {
            $("#passBox").append('<div class="mb-3"><p class="loginError">Username/password errati. Riprovare.</p></div>');
        }
        else if (result.id == -1) {
            $("#passBox").append('<div class="mb-3"><p class="loginError">Completare i campi user e password.</p></div>');
        }
        else {
            this.setState({ privilegi: result.privilegi, active: "Home", user: { username: this.state.user.username, password: this.state.user.password, id: result.id } });
        }
    }

    Welcome = (props) => {
        return (
            <div className='container'>
                <div className="card welcome-card">
                    <div className="card-header">
                        <h1>Benvenuto {this.state.user.username}</h1>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            {
                                this.state.privilegi == 1 &&
                                <div style={{ textAlign: "center" }}>
                                    <p>In quanto Amministratore hai la possibilità di gestire interamente il magazzino e gli utenti del portale.</p>
                                    <p>Ricorda sempre:</p>
                                    <br />
                                    <i>Da grandi poteri derivano grandi responsabilità</i>
                                </div>
                            }
                            {
                                this.state.privilegi == 2 &&
                                <div style={{ textAlign: "center" }}>
                                    <p>In quanto Gestore hai la possibilità di modificare le quantità di prodotti presenti in magazzino.</p>
                                    <br />
                                    <p>Buon lavoro!</p>
                                </div>
                            }
                            {
                                this.state.privilegi == 3 &&
                                <div style={{ textAlign: "center" }}>
                                    <p>In quanto Magazziniere hai la possibilità di visualizzare tutti i prodotti presenti in magazzino e le loro quantità.</p>
                                    <br />
                                    <p>Buon lavoro!</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default App;
