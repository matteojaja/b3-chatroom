import React from 'react'; // normalement j'ai pas besoin d'importer Component vu que j'importe React

class CachedEpisodesItemLister extends React.Component {
    constructor() {
        super();
        this.state = {
            seriesName: '',
            seriesList: [],
            seriesEpisodesLists: []
        };
    }

    componentDidMount() {

        let cachedSeriesList = localStorage.getItem("seriesList");
        if (cachedSeriesList){
            this.setState({seriesList: JSON.parse(cachedSeriesList)});
        }else{
            fetch('seriesList.json',
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    /*body: JSON.stringify({'yolo': 'yolo'})*/
                })
                .then(response => response.json())
                .then(seriesList => {
                    localStorage.setItem("seriesList", JSON.stringify(seriesList));
                    this.setState({seriesList: seriesList});
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        let cachedSeriesEpisodesLists = localStorage.getItem("seriesEpisodesLists");
        if (cachedSeriesEpisodesLists){
            this.setState({seriesEpisodesLists: JSON.parse(cachedSeriesEpisodesLists)});
            console.log("from local", JSON.parse(cachedSeriesEpisodesLists));
        }else{
            fetch('seriesEpisodesLists.json',
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    /*body: JSON.stringify({'yolo': 'yolo'})*/
                })
                .then(response => response.json())
                .then(seriesEpisodesLists => {
                    localStorage.setItem("seriesEpisodesLists", JSON.stringify(seriesEpisodesLists));
                    console.log("from fetch", JSON.parse(JSON.stringify(seriesEpisodesLists)));
                    this.setState({seriesEpisodesLists: seriesEpisodesLists});
                })
                .catch(function (error) {
                    console.log(error);
                })
        }

    }

    // la en fait on feinte, en utilisant une fct flechee on conserve le bon 'this', celui de la classe :)
    handleChange = (event) => {
        this.setState({
            seriesName: event.target.value
        });
    }

    render() {
        return (
            <div>
                <h2>Series+Episodes recherchés depuis LocalStorage ou à défaut /public/seriesEpisodesLists.json</h2>
                <input type="text" name="title" placeholder="coucou" value={this.state.seriesName}
                       onChange={this.handleChange}/>
                <ul>
                    {this.state.seriesName.length && this.state.seriesList.length && this.state.seriesEpisodesLists.length ?
                        this.state.seriesList.filter(item => item.seriesName.toLowerCase().indexOf(this.state.seriesName.toLowerCase()) !== -1)
                            .map(item => (
                                    <li key={item.id}>{item.seriesName}

                                        <ol>
                                            {this.state.seriesEpisodesLists

                                                .reduce((list, acc) => {
                                                    return (item.id === list.serie_id ? list.episodes_list : acc.episodes_list)
                                                })
                                                .map(ep => <li key={ep.id}>{ep.episodeName}</li>)}
                                        </ol>

                                    </li>
                                )
                            )
                        : <li>...</li>
                    }
                </ul>

            </div>
        )
    }
}

export default CachedEpisodesItemLister;