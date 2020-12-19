//var request = require('request');
const request = require('request-promise-native');
const $ = require('jquery');
const currentHost : string = window.location.hostname;
const proxyUrl = "http://"+currentHost+":3001/proxy/";

class HttpService{
    constructor() {
    }
    static async httpGetRequest(url : string) {
        return await request.get(url);
    }

    static async httpProxyGetRequest(url : string) {
        return await request.get(proxyUrl+url);
    }

    static async httpPostRequest(url : string) {
        return await request.post(url);
    }

    static async ajaxGetRequest(url : string){
        return new Promise((resolve, reject)=> {
            $.ajax({
                url: url,
                dataType: "jsonp",
                success: function( response : any ) {
                    // console.log( response ); // server response
                },
                error: function (request : any, status : any, error : any) {
                    if(request.status === 200) {
                        resolve(request.status)
                    }
                    reject(request.status)
                }
            });
        })
    }
}


export default HttpService;