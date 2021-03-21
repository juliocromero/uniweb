export default function ({ store, redirect , req}) {
         
        if(store.state.auth == false){
                return redirect('/login');
        }
      }