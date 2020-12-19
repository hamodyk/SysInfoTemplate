import * as React from 'react';
import './Menu.css';
import * as menuConfigJson from 'src/menuConfig.json';
import MenuItemList from './MenuItemList';
import {IProps} from "../ListOfItems";

class Menu extends React.Component<any,any> {
    constructor(props : IProps){
        super(props);
    }

    render() {
        return (
            <nav className={[this.props.theme, "main-menu"].join(' ')}
                 onMouseEnter={()=>{
                    document.getElementById('root')!.style.marginLeft = '11%';
                }}
                 onMouseLeave={()=>{
                     document.getElementById('root')!.style.marginLeft = '3%';
                 }}
            >
                <div>
                    <a className="logo">
                    </a>
                </div>
                <div className="settings"></div>
                <div className="scrollbar" id="style-1">
                    <ul>
                        <MenuItemList menuConfigJson={menuConfigJson} theme={this.props.theme}/>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Menu;