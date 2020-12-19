import * as React from 'react';
import './Menu.css';
import UtilsService from "../../services/UtilsService";
import MenuSubList from "../Menu/MenuSubList"
import {IProps} from "../ListOfItems";

class MenuItemList extends React.Component<any,any> {
    constructor(props : IProps){
        super(props);
    }

    render() {
        const images = UtilsService.importAllImages(require['context']('../../assets', false, /\.(gif|jpe?g|svg|png|ico)$/));
        var res : any[] = this.props.menuConfigJson.map((mainItem : any, index : number)=> {
            const sublistID : string = 'sublist-' + index;
            return (
                <li onClick={() => {mainItem.subList.items.length > 0 ? UtilsService.toggleElementDisplay(sublistID) : undefined}}>
                    <a>
                        {mainItem.isImg ?
                            <img src={images[mainItem.imgSrc]} className="image-icon"/> :
                            <i className={mainItem.class} style={mainItem.style}></i>
                        }
                        <span className={[this.props.theme, "nav-text"].join(' ')}>{mainItem.itemName}</span>
                    </a>
                    <MenuSubList itemConfig={mainItem} id={sublistID}/>
                </li>
            )
        });
        return res;
    }
}

export default MenuItemList;