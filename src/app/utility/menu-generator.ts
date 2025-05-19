export function GenerateMenu(res: any, iconMap: any) {
    let output = "";

    res.forEach((parent: any) => {
        if (parent.parent_id <= 0) {
            if (parent.parent_id === 0) {
                output += `<div class="a-menu-item" id="a_menu_item_${parent.id}">
                                <div class="menu-item">
                                    <img src="assets/images/a_menu_item_image.svg" class="menu-icons"/>
                                    <h4 class="menu-item-text">${parent.menu_name}</h4>
                                </div>
                            </div>`;
            }

            if (parent.parent_id === -1) {
                output += `<div class="a-menu-item" id="a_menu_item_${parent.id}">
                                <div class="menu-item">
                                    <img src="assets/images/a_menu_item_image.svg" class="menu-icons" />
                                    <h4 class="menu-item-text">${parent.menu_name}</h4>
                                    
                                </div>    
                                <img src="assets/images/down-arrow.svg" class="a-menu-item-subitem-toggle" id="toggle-${parent.id}"/>                            
                            </div>`;
            }

            output += `<div class="submenu" id="submenu-${parent.id}">`;

            res.forEach((child: any) => {
                if (child.parent_id === parent.id) {
                    output += `<div class="a-menu-item-child" onclick="navigateTo('${child.route_name}')">
                                    <div class="menu-item">
                                        <img src="assets/images/a_menu_item_image.svg" class="menu-icons" />
                                        <h4 class="menu-item-text">${child.menu_name}</h4>
                                    </div>
                               </div>`;
                }
            });

            output += `</div>`;
        }
    });

    return output;
}