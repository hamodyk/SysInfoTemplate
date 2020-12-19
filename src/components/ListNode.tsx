import * as React from 'react';
import './List.css';
import './ListNodeLoader.css';
import * as HttpService from "../services/HttpService";
import * as configJson from 'src/config.json';
import ParseConfigService from "../services/ParseConfigService";
import ConsulService from "../services/ConsulService";

export interface IProps {
    nodeData: any;
    serviceName: string;
    subEnv: string;
}

class ListNode extends React.Component <any,any>{
    constructor(props : IProps){
        super(props);
        this.state = {
            isEMRmaster: null
        }
    }

    componentDidMount(){
        const node = this.props.nodeData;
        const serviceType = getServiceType(this.props.serviceName, this.props.subEnv);
        switch (serviceType) {
            case "emr":
                HttpService.default.ajaxGetRequest("http://" + node["Node"]["Address"] + ":8088/cluster").then((result) => {
                    this.setState({isEMRmaster: true});
                }).catch((reason) => {
                    this.setState({isEMRmaster: false});
                });
                break;
            default:
                break;
        }
    }

    render() {
        return renderBasedOnType(this);
    }
}

function renderBasedOnType(that: any){
    const node = that.props.nodeData;
    const serviceName : string = that.props.serviceName;
    const theme : string = that.props.theme;
    const ip = node["Node"]["Address"];
    const serviceType = getServiceType(serviceName, that.props.subEnv);
    var res : any;
    switch (serviceType) {
        case "emr":
            if(that.state.isEMRmaster === true){
                res =  <label style={{color:nodeStatusToColor(node, serviceName, theme)}}><a href={"http://"+ip+":8088"} target="_blank">{ip} (Master)</a></label>;
            }
            else if(that.state.isEMRmaster === false){
                res = <label style={{color:nodeStatusToColor(node, serviceName, theme)}}>{ip}</label>;
            }
            else{
                //show loading animation
                res = <label style={{color:nodeStatusToColor(node, serviceName, theme)}}>{ip}
                    <div className="loader"/>
                </label>;
            }
            break;
        case "couchbase":
            res = <label style={{color:nodeStatusToColor(node, serviceName, theme)}}><a href={"http://"+ip+":8091"} target="_blank">{ip}</a></label>;
            break;
        case "storm":
            res = <label style={{color:nodeStatusToColor(node, serviceName, theme)}}><a href={"http://"+ip+":8080"} target="_blank">{ip}</a></label>;
            break;
        case "server":
            res = <label style={{color:nodeStatusToColor(node, serviceName, theme), fontSize:scaleFontSize(ip)}}><a href={ip} target="_blank">{ip}</a></label>;
            break;
        default:
            res = <label style={{color:nodeStatusToColor(node, serviceName, theme), fontSize:scaleFontSize(ip)}}>{ip}</label>;
            break;
    }
    return res;
}

function scaleFontSize(text : string){
    return text.length > 29 ?  "0.7em" : "0.9em";
}

function getServiceType(serviceName : string, subEnv : string) : string{
    const defaultVal : string = "unknown";
    var serviceType = defaultVal;
    // configJson.expectedConsulServices.some((expectedService) => {
    //     if(serviceName.indexOf(expectedService.serviceName) >= 0){
    //         serviceType = expectedService.type;
    //         return true;
    //     }
    //     return false;
    // });
    if(serviceType !== defaultVal){
        return serviceType;
    }
    else{
        const mainEnv : string = ParseConfigService.subEnvToMainEnv(subEnv);
        const typeOfComponent = configJson.environments.mainEnvironments.find((currentMainEnv) => currentMainEnv.envName === mainEnv)!.
            subEnvironments.find((currentSubEnv) => currentSubEnv.envName === subEnv)!.
            customChecks.find((currentCustomCheck) => currentCustomCheck.componentName === serviceName)!.type;
        if(typeOfComponent){
            return typeOfComponent;
        }
        else{
            return defaultVal;
        }
    }
}

function nodeStatusToColor(node : any, serviceName : string, theme : string){
    const status : string = ConsulService.getNodeStatus(node, serviceName);
    let color : string;
    switch(status){
        case 'passing':
            color = (theme === 'Theme3' || theme === 'Theme1') ? 'limegreen' : 'green';
            break;
        case 'critical':
            color = 'red';
            break;
        default:
            color = 'black';
            break;
    }
    return color;
}

export default ListNode;
