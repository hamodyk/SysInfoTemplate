class ConsulService {
    static isNodeFailing(node : object) {
        return node["Checks"].some((nodeCheck : any) => {
            return nodeCheck.Status !== 'passing';
        });
    }

    static getNodeStatus(node : object, serviceName : string){
        const nodeCheck = node["Checks"].find((nodeCheck : any) => {return nodeCheck.ServiceID === serviceName});
        if(nodeCheck){
            return nodeCheck["Status"];
        }
        else {
            if(node["Checks"][0]){
                return node["Checks"][0]["Status"];
            }
            else{
                return "unknown";
            }
        }
    }
}

export default ConsulService