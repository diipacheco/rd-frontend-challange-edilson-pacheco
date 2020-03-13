(() => {
     const selector = (selector) =>  document.querySelector(selector);
     /* trecho omitido */
     const create = element => document.createElement(element); /* trecho omitido */

    const app = selector('#app'); 

    const Login = create('div');
    Login.classList.add('login');

    const Logo = create('img');
    Logo.src = './assets/images/logo.svg';
    Logo.classList.add('logo');

    const Form = create('form');

    
    Form.onsubmit = async e => {
        e.preventDefault();

        const [email, password] = e.target.elements;

        const {url} = await fakeAuthenticate(email.value, password.value);

        location.href='#users';
        
       await getDevelopersList(url);
    };

    Form.oninput = e => {
        const [email, password, button] = e.target.parentElement.children;
        
        (!email.validity.valid || !email.value || password.value.length <= 5) 
            ? button.setAttribute('disabled','disabled')
            : button.removeAttribute('disabled');
    };

    
    
    Form.innerHTML = 
       `<input type="email" class="signin-input" placeholder="Entre com seu email"/>
        <input type="password" class="signin-input" placeholder="Digite sua senha supersecreta"/>
        <button type="submit" id="submit">Entrar</button>         
       `
       
    app.appendChild(Logo);
    app.appendChild(Login);
    Login.appendChild(Form);
    
    async function fakeAuthenticate(email, password) {

        const response = await fetch('http://www.mocky.io/v2/5dba690e3000008c00028eb6');
        const data = await response.json();

         const fakeJwtToken = `${btoa(email+password)}.${btoa(data.url)}.${(new Date()).getTime()+300000}`;
        return data;
    }

    const userlist = []

    async function getDevelopersList(url) {

        const response = await fetch(url);
        const data = await response.json();

        data.map((att)=>  {
            userlist.push({
                id: att.id,
                avatar_url: att.avatar_url,
                login: att.login
            })
        })

        renderPageUsers();
    }

    function renderPageUsers() {

        app.classList.add('logged');

        Login.style.display = 'none';

        const Ul = create('ul');

        Ul.classList.add('container');

        Ul.innerHTML = '';  

        userlist.forEach(user => {             
             let userLogin = create('h3');
             userLogin.appendChild(document.createTextNode(user.login));

             let userAvatar = create('img');
             userAvatar.setAttribute('src', user.avatar_url);
             user.Avatar.classList.add('avatar-url');

            // let listItemEL = document.createElement('li');
            // listItemEL.appendChild(userLogin);
            
            // Ul.appendChild(listItemEL);
        })
        app.appendChild(Ul)
    }

    // init
    (async function(){
       // const rawToken = /* trecho omitido */
        //const token = rawToken ? rawToken.split('.') : null
        
        // if (!token || token[2] < (new Date()).getTime()) {
        //     localStorage.removeItem('token');
        //     location.href='#login';
        //     app.appendChild(Login);
        // } else {
        //     location.href='#users';
        //     const users = await getDevelopersList(atob(token[1]));
        //     renderPageUsers(users);
        // }
    })()
})()