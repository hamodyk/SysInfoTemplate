class UtilsService {
    static toggleElementDisplay(elementID : string){
        document.getElementById(elementID)!.style.display === 'block' ?
            document.getElementById(elementID)!.style.display = 'none' :
            document.getElementById(elementID)!.style.display = 'block';
    }

    static importAllImages(r : any) {
        let images = {};
        r.keys().map((item : any, index : any) => { images[item.replace('./', '')] = r(item); });
        return images;
    }
}

export default UtilsService