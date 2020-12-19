import * as React from 'react';
import './App.css';
import './components/Loader.css';
import ParseConfigService from "./services/ParseConfigService";
import ListOfItems from "./components/ListOfItems";
import Menu from "./components/Menu/Menu";

interface IState {
    data: any[],
    time: any,
    selectedTheme: any
}

class App extends React.Component<any,IState> {
    private static readonly theme1 = "Theme1";
    private static readonly theme2 = "Theme2";
    private static readonly theme3 = "Theme3";

    constructor(props : any){
        super(props);
        this.handleThemeChange = this.handleThemeChange.bind(this);
        this.state = {
            data: [],
            time: null,
            selectedTheme: null
        };
    }

    private setInitialSelectionState(){
        const themeFromLocalStorage = App.getThemeFromLocalStorage();

        // add the selected theme to be the current theme of the body
        if (themeFromLocalStorage != null) {
            this.setState({selectedTheme: themeFromLocalStorage});
            document.body.classList.add(themeFromLocalStorage);
        }
    }

    private static getThemeFromLocalStorage(){
        if (typeof(Storage) !== "undefined") { //if the browser supports local storage
            return localStorage.getItem("theme");
        }
        return App.theme1;
    }

    private handleThemeChange(e : any){
        if(e.target) {
            const newSelectedTheme = e.target.value;

            // remove the old theme from the class list and add the new one instead
            document.body.classList.remove(this.state.selectedTheme);
            document.body.classList.add(newSelectedTheme);

            this.setState({selectedTheme: newSelectedTheme});
            App.saveThemeToBrowserStorage(newSelectedTheme);
        }
    }

    private static saveThemeToBrowserStorage(theme : any){
        if (typeof(Storage) !== "undefined") {
            // console.log("Local browser storage is available");
            localStorage.setItem("theme", theme);
        }
        else {
            console.warn("Local browser storage is not available");
        }
    }

    componentDidMount(){
        setInterval(this.updateComponent.bind(this), 240*1000);
        this.getData();
        this.setInitialSelectionState();
    }

    private updateComponent(){
        console.clear();
        window.stop(); //cancel all pending requests
        this.setState({ time: Date.now() });
        this.setState({ data: [] });
        this.getData();
    }

    private getData(){
        const environmentsPromises = ParseConfigService.getEnvironmentServicesHealth();
        for(const env in environmentsPromises){
            this.resolvePromises(environmentsPromises, env);
        }
    }

    private resolvePromises(environmentsPromises : any, env : any){
        environmentsPromises[env].forEach((promise : Promise<object>) => {
            promise.then((result) => {
                var currentData = this.state.data;
                if(!currentData[env]){
                    currentData[env] = [];
                }
                currentData[env].push(result);
                this.setState({data: currentData});
            }).catch((reason) => {
                console.error(reason);
            })
        })
    }

    public render() {
        return (
            <div>
                <Menu theme={this.state.selectedTheme}/>
                <div>
                    <h2 className={[this.state.selectedTheme, "siteTitle"].join(' ')}>SYSTEM INFO</h2>
                </div>
                {
                  Object.keys(this.state.data).length === 0 ?
                  <div id="loading-wrapper">
                      <div id="loading-text">LOADING</div>
                      <div id="loading-content"/>
                  </div>
                  :
                  this.renderLists(this.state.data)
                }
                <div>
                    <select value={this.state.selectedTheme}
                            onChange={this.handleThemeChange}
                            className={"ThemeSelection"} name="themes" id="themes">
                        <option value={App.theme1}>Theme 1</option>
                        <option value={App.theme2}>Theme 2</option>
                        <option value={App.theme3}>Theme 3</option>
                    </select>
                </div>
            </div>
        )
    }

    private renderLists(data : any){
        const result : any [] = [];
        const servicesStatus : any[] = [];
        const sortedDataKeys : string[] = this.sortData(data);
        sortedDataKeys.map((env) => {
            data[env].map((serviceHealth: any) => {
                var serviceHealthAsJson;
                try {
                    serviceHealthAsJson = typeof(serviceHealth) === 'string' ? JSON.parse(serviceHealth) : serviceHealth;
                }
                catch (e) {
                    return;
                }
                if (Object.keys(serviceHealthAsJson).length > 0) {
                    if (!servicesStatus[env]) {
                        servicesStatus[env] = [];
                    }
                    servicesStatus[env].push(serviceHealthAsJson);
                }
                else if (Object.keys(serviceHealthAsJson).length > 0) {
                    if (!servicesStatus[env]) {
                        servicesStatus[env] = [];
                    }
                    servicesStatus[env].push(serviceHealthAsJson);
                }
            });
            result.push(<ListOfItems data={servicesStatus[env]} title={env} key={env} theme={this.state.selectedTheme}/>);
        });
        return result;
    }

    private sortData(data : any){
        return Object.keys(data).sort((a : string, b: string) => {
            a = a.toLowerCase();
            b = b.toLowerCase();

            if(a.indexOf('prod') >= 0){
                a = "a";
            }
            else if(a.indexOf('uat') >= 0){
                a = "b";
            }
            else if(a.indexOf('ci') >= 0){
                a = "c";
            }
            else if(a.indexOf('dev') >= 0){
                a = "d";
            }
            if(b.indexOf('prod') >= 0){
                b = "a";
            }
            else if(b.indexOf('uat') >= 0){
                b = "b";
            }
            else if(b.indexOf('ci') >= 0){
                b = "c";
            }
            else if(b.indexOf('dev') >= 0){
                b = "d";
            }
            var res : number;
            a > b ? res = 1 : res = -1;
            return res;
        });
    }
}


export default App;
