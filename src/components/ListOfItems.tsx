import * as React from 'react';
import './List.css';
import ListNode from './ListNode';
import ConsulService from "../services/ConsulService";
import UtilsService from "../services/UtilsService";

export interface IProps {
    data: any;
    title: string
}

class ListOfItems extends React.Component<any,any> {
    constructor(props : IProps){
        super(props);
        this.state = {
            sparkData: null
        }
    }

    render() {
        if (!this.props.data) {
            return null;
        }
        return (
            <div className={[this.props.theme, "container"].join(' ')}>
                <h1 className={this.props.theme}>{this.props.title.toUpperCase()}</h1>
                <div className="items">
                    {renderItems(this.props.data, this.props.title, this.props.theme)}
                </div>
            </div>
        );
    }
}

function renderItems(data : any, env : string, theme : string){
    const res : any[] = [];
    data.forEach((serviceHealth : any) => {
        const isServiceFailing : boolean = serviceHealth.some((serviceNode : any) => {
            return ConsulService.isNodeFailing(serviceNode);
        });
        const serviceNameWithEnv : string = serviceHealth[0]["Service"]["ID"];
        const nodesElementId : string = serviceNameWithEnv+"-"+env+"-nodes";
        res.push(
            <div>
                <label onClick={()=>{handleServiceClick(nodesElementId)}}>
                    {serviceNameWithEnv.split("-")[0]}
                    <span className="serviceStatus">
                        <span className={[theme, "badge"].join(' ')}>{serviceHealth.length}</span>
                        {isServiceFailing ? <i className="item-icon fas fa-times"/> :  <i className="item-icon fas fa-check"/>}
                    </span>
                </label>
                <div id={nodesElementId} style={{display: 'none'}}>
                    {renderNodes(serviceHealth,serviceNameWithEnv, env, theme)}
                </div>
            </div>
        );
    });

    return res;
}

function renderNodes(serviceHealth : any, serviceNameWithEnv : string, subEnv : string, theme: string){
    const res : any[] = [];
    serviceHealth.forEach((node : any) => {
        res.push(
            <ListNode nodeData={node} serviceName={serviceNameWithEnv} subEnv={subEnv} theme={theme}/>
        )
    });
    return res;
}


function handleServiceClick(nodesElementId : string){
    UtilsService.toggleElementDisplay(nodesElementId);
}

export default ListOfItems;
