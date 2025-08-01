// const { compareSync } = require("bcrypt");

let links = document.querySelectorAll('.links');

links.forEach(link =>{
    link.addEventListener('click',()=>{
        links.forEach(item => item.classList.remove('active'))
        links.classList.add('active');
    })
})

const toggleBtn = document.querySelector('.toggle-btn');
const ul = document.querySelector('.nav-links-container');

toggleBtn.addEventListener('click', ()=>{
    toggleBtn.classList.toggle('active');
    ul.classList.toggle('active');
})


let project = document.querySelectorAll('.project-card');

project.forEach((card, index)=>{
    let closeBtn= card.querySelector('.close-btn');
    closeBtn.addEventListener('click', ()=>{
        project.forEach((item,i)=>{
                if(i != index){
                    item.classList.remove('blur');
                }
            })
        card.classList.remove('active');
    })

    card.addEventListener('click',(e)=>{
        if(e.target != closeBtn)
        {
            project.forEach((item,i)=>{
                if(i != index){
                    item.classList.add('blur')
                }
            })
            card.classList.add('active')
        }
        
    })
});

const tags = document.querySelectorAll('.filter-btn');

tags.forEach(btn =>{
    btn.addEventListener('click',()=>{
        project.forEach(card =>{
            if(btn.innerHTML.toLowerCase() == 'all')
            {
                card.style.display = 'block';
            }
            else{
                // console.log(card);
                if(card.getAttribute('data-tags').includes(btn.innerHTML.toLocaleLowerCase()))
                {
                    card.style.display = 'block';
                }
                else{
                    card.style.display = 'none';
                }
            }
        })
        tags.forEach(item => item.classList.remove('active'));
        btn.classList.add('active');
    })
})