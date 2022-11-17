

export default {
    menusVisible (name: string) {
        const menus = localStorage.getItem('role_menus')
        if(menus !== null && menus.length > 0) {
          if (!menus.includes(name)) {
               return false
        } else {
          return true
        }
        } 
  }
} 