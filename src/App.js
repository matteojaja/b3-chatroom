import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase'
import marked from 'marked'
import ReactHtmlParser from 'react-html-parser'

// this component will be rendered by our <___Router>


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg:'hello',
            user: false,
            tablo: [],
            message: ''
        }
        this.handleChangeMsg = this.handleChangeMsg.bind(this)
        this.tamerelapute = this.tamerelapute.bind(this)
    }
    // define methods under the `methods` object
    handleChangeMsg (event){
        this.setState({message: event.target.value});
    }

    tamerelapute (e) {
        if (this.state.user) {
            let entry = {
                ts: new Date().getTime(),
                uid: this.state.user.uid,
                displayName: this.state.user.displayName,
                message: this.state.message.toString()
            }

            firebase.database().ref('messages/').push(entry, (error) => {
                if (error) {
                    alert("dla merde")
                } else {
                    // alert("yeah")
                    this.setState( { message : '' } )
                }
            });
        }
        e && e.preventDefault();
    }
    loadFile (event) {
        if(event.target.files[0]) {
            const file = event.target.files[0];
            //const reader = new FileReader();
            // TODO : check si c'est une image
            let img = new Image;
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                let canvas = this.$refs['imgCanvas']
                let ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 200, 100)
                canvas.toBlob(blob => {
                    // inject into storage then send msg
                    firebase.storage().ref('images/').child(file.name)
                        .put(blob)
                        .then(snapshot => {
                            snapshot.ref.getDownloadURL()
                                .then(downloadURL => {
                                    this.setState( {message : "![prout](" + downloadURL + ")" } )
                                    this.tamerelapute()
                                    // TODO : cleanup canvas && fileinput
                                });
                        })

                }, 'image/webp', 0.8)
            };
        }
    }
    login () {

        let googleAuthProvider = new firebase.auth.GoogleAuthProvider()
        googleAuthProvider.addScope('https://www.googleapis.com/auth/plus.login')
        //firebase.auth().languageCode = 'fr'
        firebase.auth().signInWithPopup(googleAuthProvider)
    }
    logout () {
        firebase.auth().signOut()
    }


    markdownTablo () {
        return (this.state.tablo).map(entry => {
            return ({
                ts: entry.ts,
                uid: entry.uid,
                displayName: entry.displayName,
                message: marked((entry.message).toString(), {sanitize: true})
            })
        })

    }

    componentDidMount() {
        firebase.database().ref('messages/').on('value', snapshot => {
            if (snapshot.val() !== null) {
                this.setState( {tablo : Object.values(snapshot.val())})
            }
        });
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // User is signed in.
                this.setState ( { user : user } )
            } else {
                // No user is signed in.
                this.setState ( { user : false } )
            }
        });
    }

    ListItemps;
    shouldComponentUpdate(nextProps, nextState) {
        this.listItems = Object.values(nextState.tablo).map( (tab) =>
            <li className={this.isClassUser(tab.user)}>
                { tab.user } : { tab.msg } : {ReactHtmlParser(this.compiledMarkdown(tab.msgMd))}
                {tab.ts} :{tab.displayName} {ReactHtmlParser(tab.message)} :
            </li>
        )
        return true
    }

    isuserChat =  () => {
        if (this.state.user) {
            return (
                <div>
                    <input type="file" onChange={this.loadFile} />
                    <input type="text" placeholder="texte" onChange={this.handleChangeMsg}/>
                    <input type="submit" value="Submit" onChange={this.tamerelapute}/> ;
                </div>

            )
        }};
    render() {
        let isuser =  (this.state.user) ? <button onClick={this.logout}>logout</button> : false;
        let isuserName =  (this.state.user) ? <h1 >{this.state.user.displayName}</h1> : false;

        return (
            <div className="hello">
                <h1>{this.state.msg}</h1>

                <button onClick={this.login}>login</button>
                {isuser}
                {this.listItems}
                {isuserName}
                {this.isuserChat()}

            </div>

        );
    }
}

export default App;

