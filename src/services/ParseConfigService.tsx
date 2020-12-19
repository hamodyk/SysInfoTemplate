import * as configJson from 'src/config.json';
import * as HttpService from 'src/services/HttpService';

class ParseConfigService{
    static getEnvironmentServices(){
        this.getEnvironmentServicesHealth();
    }

    static getEnvironmentServicesHealth(){
        var environmentPromises : any[] = [];
        configJson.environments.mainEnvironments.forEach(function(mainEnv){
            mainEnv.subEnvironments.forEach(function(subEnv){
                const promises : Promise<any>[] = [];
                subEnv.customChecks.forEach(function(customCheck){
                    if(customCheck.componentName){
                            if(customCheck.check === 'http'){
                            var promisesToPack : Promise<object>[] = [];
                            customCheck.sources.map((source) => {
                                promisesToPack.push(transformPromise(HttpService.default.httpProxyGetRequest(encodeURIComponent(source)), source, customCheck.componentName));
                            });
                            promises.push(packPromises(promisesToPack));
                        }
                    }
                });
                environmentPromises[subEnv.envName] = promises;
            })
        });
        return environmentPromises;
    }

    static subEnvToMainEnv(subEnvironment : string){
        var res : string = "unknown";
        configJson.environments.mainEnvironments.some((mainEnv) => {
            return mainEnv.subEnvironments.some((subEnv) => {
                if(subEnv.envName === subEnvironment){
                    res = mainEnv.envName;
                    return true;
                }
                return false;
            })
        });
        return res;
    }
}

function packPromises(promises : Promise<object>[]){
    return new Promise<object>((resolve, reject) =>{
        Promise.all(promises).then((res) => resolve(res)).catch((reason)=> reject(reason));
    })
}

function transformPromise(promise : Promise<object>, source : string, component : string){
    return new Promise<object>((resolve, reject) =>{
        var transformedPromise : any = { "Node": { "Address": "" }, "Service": { "ID": "", "Service": "", }, "Checks": [{ "Status": "" } ] };
        transformedPromise.Node.Address = source;
        transformedPromise.Service.ID = component;
        transformedPromise.Service.Service = component;
        promise.then((res) => {
            transformedPromise.Checks[0].Status = "passing";
            resolve(transformedPromise);
        }).catch((reason) =>{
            transformedPromise.Checks[0].Status = "critical";
            resolve(transformedPromise);
        })
    })
}

export default ParseConfigService
