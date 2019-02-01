import _ from 'lodash';
import React from 'react'; // normalement j'ai pas besoin d'importer Component vu que j'importe React
import {CSSTransitionGroup} from 'react-transition-group' // ES6


class ApiItemLister extends React.Component {

    constructor() {
        super();
        this.state = {
            seriesName: '',
            seriesList: [],
        };
        // pour eviter de lancer trop d'appels a l'api, je passe le fetch au travers d'un *debounce*
        // cela permet de temporiser les appels, i.e ne traite que le dernier appel sur une periode de 500ms
        // j'utilise le debounce de lodash, une librairie d'utilitaires que je recommande chaudement
        this.fetchSeries = _.debounce(this.fetchSeries, 500);
    }

    componentDidMount() {
    }

    /**
     * debounced fetch
     * @param url
     */
    fetchSeries = (url) => {
        fetch(url,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                //body: JSON.stringify({'keyword': event.target.value})
            })
            .then(response => response.json())
            .then(seriesList => {
                this.setState({seriesList: seriesList});
            })
            .catch(function (error) {
                console.log(error);
            })
    }


    // la en fait on feinte, en utilisant une fct flechee on conserve le bon 'this', celui de la classe :)
    handleChange = (event) => {

        this.setState({
            seriesName: event.target.value
        });

        if (event.target.value.trim() === "") {
            // on cherche rien , je vais pas me faire chier a aller demander un truc a l'API...
            this.setState({seriesList: []});
        } else {
            // params a envoyer
            let params = {
                "keyword": event.target.value
            }
            // cconstruction de la string Url
            var searchParams = new URLSearchParams();
            for (var name in params) {
                searchParams.append(name, params[name])
            }
            var url = new URL('/henry/api/serie/?' + searchParams, 'http://212.47.242.80');
            this.fetchSeries(url);
        }

    }

// si une season est dselectionnéee afficher les ep.
// je fais ca a la porc
    loadSeasonEpisodes = (seasonId) => {
        console.log(seasonId);


        // params a envoyer
        let params = {
            "id": seasonId
        }
        // cconstruction de la string Url
        var searchParams = new URLSearchParams();
        for (var name in params) {
            searchParams.append(name, params[name])
        }
        var url = new URL('/henry/api/season/?' + searchParams, 'http://212.47.242.80');

        fetch(url,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(fetchedSeason => {
                let tmpSeries = this.state.seriesList;
                tmpSeries.map((serie) => {
                    serie.seasons.map(season => {
                        if (season.id === fetchedSeason[0].id) {
                            season.episodes = fetchedSeason[0].episodes;
                        }
                    })
                })
                this.setState({seriesList: tmpSeries});

            })
            .catch(function (error) {
                console.log(error);
            })

        // this.setState({
        //     seriesName: event.target.id
        // });

    }

    render() {
        // decoupe le tableau en sous tableaux de 3 elements
        // ca va me servir parce que  ROWS/COLS en responsive grid
        const chunks = _.chunk(this.state.seriesList, 3);
        return (
            <div>
                <div className="row">
                    <h2>Series+Saisons recherchés depuis API REST yo</h2>
                    <input type="text" name="title" placeholder="coucou" value={this.state.seriesName}
                           onChange={this.handleChange}/>
                </div>
                <CSSTransitionGroup component="div" className="row" transitionName="example"
                                    transitionEnterTimeout={700} transitionLeaveTimeout={700}>
                    {this.state.seriesList.length ?
                        chunks.map(chunk => (
                            <div className="row">
                                {chunk.map(serie => (
                                        <article key={serie.id} className="four columns">
                                            <hr/>
                                            {serie.banner.length ? <img className="u-max-full-width"
                                                                        src={'https://www.thetvdb.com/banners/_cache/' + serie.banner}
                                                                        alt={serie.name}></img> : ''}

                                            <h5>{serie.name}</h5>
                                            {serie.translation !== "" ? <h6>( {serie.translation} )</h6> : ''}
                                            <hr/>
                                            <ul>
                                                {serie.seasons.map(season =>
                                                    season.episodes_count > 0 ?
                                                        <li key={season.id} onClick={() => {this.loadSeasonEpisodes(season.id)}}>
                                                            <em >S{('0' + season.name).slice(-2)}</em> ({season.episodes_count} ep.)
                                                            {season.episodes ?
                                                                <ul>
                                                                    {season.episodes.map(episode =>
                                                                        <li key={episode.id}>{episode.name}</li>
                                                                    )}
                                                                </ul>
                                                                : ''}
                                                        </li>
                                                        : ''
                                                )}
                                            </ul>
                                        </article>
                                    )
                                )}
                            </div>
                        ))
                        : <article className="twelve columns"> Pouet </article>
                    }
                </CSSTransitionGroup>

            </div>
        )
    }
}

export default ApiItemLister;