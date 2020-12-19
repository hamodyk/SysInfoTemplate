import * as React from 'react';
import './Menu.css';
import UtilsService from "../../services/UtilsService";

class MenuSubList extends React.Component<any,any> {

    render() {
        const images = UtilsService.importAllImages(require['context']('../../assets', false, /\.(gif|jpe?g|svg|png|ico)$/));
        // console.log(this.props.index);
        return (
            <ul id={this.props.id} style={{display: 'none'}}>
                {
                    this.props.itemConfig.subList.items.map((sublistItem : any) => {
                        return (
                            <li className="darkerli">
                                <a href={sublistItem.href} target="_blank">
                                    {this.props.itemConfig.isImg ?
                                        <img src={images[this.props.itemConfig.imgSrc]} className="image-icon"/> :
                                        <i className={this.props.itemConfig.class} style={this.props.itemConfig.style}></i>
                                    }
                                    <span className="nav-text">{sublistItem.itemName}</span>
                                </a>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }


}

export default MenuSubList;