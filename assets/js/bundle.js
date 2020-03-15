(() => {

    function handleLoading(loading = true) {
        if(loading === true) {
            const loadingEl = create('h2');
            loadingEl.appendChild(document.createTextNode('Loading...'));
            loadingEl.setAttribute('id', 'loading');

            app.appendChild(loadingEl);

            Login.style.display = 'none';
        } else {
            document.getElementById('loading').remove();
        }
    }

    async function fakeAuthenticate(email, password) {

        const response = await fetch('http://www.mocky.io/v2/5dba690e3000008c00028eb6');
        const data = await response.json();

       
        const fakeJwtToken = `${btoa(email+password)}.${btoa(data.url)}.${(new Date()).getTime()+300000}`;
        localStorage.setItem(TOKEN_KEY, fakeJwtToken);

        return data;
    }

     function getDevelopersList(url) {
        
        handleLoading();

        setTimeout(async () => {
            try {
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
    
            handleLoading(loading = false);
    
            } catch (error) {
                return;
            }

        }, 3000);
        
    }

    function renderPageUsers() {

        app.classList.add('logged');

        const Ul = create('ul');

        Ul.classList.add('container');

        Ul.innerHTML = '';  

        userlist.forEach(user => {             
            const listItemEL = document.createElement('li');
            listItemEL.classList.add('user-content');
            
            const userLogin = create('h3');
            userLogin.appendChild(document.createTextNode(user.login));
            
            const userAvatar = create('img');
            userAvatar.setAttribute('src', user.avatar_url);
            userAvatar.classList.add('avatar-url');
            
            listItemEL.appendChild(userAvatar);
            listItemEL.appendChild(userLogin);
            
            Ul.appendChild(listItemEL);
        })

        app.appendChild(Ul)
    }

    (async function(){
         const rawToken = localStorage.getItem(TOKEN_KEY);
         const token = rawToken ? rawToken.split('.') : null
        
          if (!token || token[2] < (new Date()).getTime()) {
              localStorage.removeItem(TOKEN_KEY);
              location.href='#login';
              app.appendChild(Login);
          } else {
              console.log('entrou aqui');
              location.href='#users';
              const users = getDevelopersList(atob(token[1]));
              renderPageUsers(users);
          }
    })()

     const selector = (selector) =>  document.querySelector(selector);
     
     const create = element => document.createElement(element);

     const TOKEN_KEY = '@rd-frontend-challenge-TOKEN';

     const userlist = [];

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
        
        getDevelopersList(url);
    }; 

    Form.oninput = e => {
        const [email, password, button] = e.target.parentElement.children;

           if(!email.validity.valid || !email.value || password.value.length <= 5) {
                 button.setAttribute('disabled','disabled');
                 button.removeAttribute('id', 'available');
                 button.setAttribute('id', 'submit');
           } else {
              button.removeAttribute('disabled');
              button.setAttribute('id', 'available');
           }
    };    
    
    Form.innerHTML = 
       `<input type="email" class="signin-input" placeholder="Entre com seu email"/>
        <input type="password" class="signin-input" placeholder="Digite sua senha supersecreta"/>
        <button type="submit" id="submit">Entrar</button>         
       `
       
    app.appendChild(Logo);
    app.appendChild(Login);
    Login.appendChild(Form);

})()