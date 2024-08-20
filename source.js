
 //api links 
 const category_url = 'https://remotive.com/api/remote-jobs/categories';
 const all_Jobs_Url = 'https://remotive.com/api/remote-jobs?limit=50';

 //Selected Elements to Manipulate the Dom


//  Html Elements 
 const board = document.querySelector("#board");
 const dropMenu = document.querySelector('#dropMenu');
 const searchButton=document.querySelector('#serchButton');
 const searchgInput=document.querySelector('#searchInput');
 const removeTest = document.querySelector('#removeTest');

 //to save in localStorage
 let savedJobs=JSON.parse(localStorage.getItem('savedJobs'))||[] ;
 let jobsFatched=[] ;
 let currentPage = 'allJobs';



 // gets all the categories
 async function categoriestToSelect() {
     try {
         const response = await fetch(category_url);
         const data = await response.json();
         const categories = data.jobs;

dropMenu.innerHTML = ''

         categories.forEach((category)=>{
             dropMenu.innerHTML+=`
              <li><a class="dropdown-item" href="#" onclick="filterJobsByCategory('${category.name}')">${category.name}</a></li>
             `
         })
     }catch (error){
         console.log(error)
     }
 }

 // function to Filter by Category (Also Insures that the Filter convert all to lowercase letters to preform the search Currectly)
 function filterJobsByCategory(category) {
    const filteredJobs = jobsFatched.filter(job => job.category.toLowerCase() === category.toLowerCase());
    buildAllJobs(filteredJobs);
}
function buildHomePage(){
board.innerHTML=""

board.innerHTML=`   <h1>This is a test for a home page</h1>
<p>
  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem
  necessitatibus labore eveniet ducimus! Exercitationem ex in repellat,
  fugit eaque suscipit accusantium dolor rerum facilis voluptate tempore.
  Aliquid dolore voluptatem eius debitis, voluptatibus praesentium
  similique, animi assumenda sed laboriosam illo omnis.
</p>
<h1> Enjoy </h1>
`

}


// // Sends Request To the API and Saves the jobs to JobsFatched 
 async function fatchJobs() {
     try {
         const response = await fetch(all_Jobs_Url);
         const data = await response.json();
         const jobs = data.jobs;
         jobsFatched = jobs;
         localStorage.setItem('jobsFatched', JSON.stringify(jobsFatched));
         categoriestToSelect()
        
     } catch (error) {
         console.error('Error fetching jobs:', error);
     }
 }

// Handles the  input value and  converts it to lower case 
 document.querySelector('#searchInput').addEventListener('input', () => {
    const keyword = document.querySelector('#searchInput').value.trim().toLowerCase();
    searchJobs(keyword);
});

//Function that Handels the search it self with a given value from an input
function searchJobs(keyword) {
    if (keyword === '') {
        buildAllJobs(jobsFatched);
    } else {
        const filteredJobs = jobsFatched.filter(job => 
            job.title.toLowerCase().includes(keyword) ||
            job.company_name.toLowerCase().includes(keyword) ||
            job.description.toLowerCase().includes(keyword)
        );
        buildAllJobs(filteredJobs);
    }
}

// Builds All Jobs 
 function buildAllJobs(jobs) {
    board.innerHTML = ''; 
    currentPage = 'allJobs';
    jobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.width = '22rem';
        card.style.marginTop = '50px';
       
        const isSaved = savedJobs.some(savedJob => savedJob.id === job.id);
        const buttonText = isSaved ? 'Remove Job' : 'Save Job';
        const buttonClass = isSaved ? 'btn btn-danger' : 'btn btn-primary';
        const buttonAction = isSaved ? `removeJob(${job.id})` : `saveJob(${job.id})`;

        card.innerHTML = `
        <ul class="list-group list-group-flush">
            <li class="list-group-item text-center bg-primary text-white" style="border-radius:1px solid black; text-decoration: underline;">Company Name: ${job.company_name}</li>
        </ul>
        <img id="inDivImg" src="${job.company_logo}" style='height:100px; width:100px; text-align: center;' class="card-img-top" alt="Company Logo" loading="lazy">
        <h5 class="card-title">${job.title}</h5>
        <div style="overflow-x: auto; width: 330px; height: 300px; margin-left: 10px;" class="card-body">
            <p class="card-text fs-6 lh-1">${job.description}</p>
        </div>
        <div class="card-body">
            <a href="#" onclick="${buttonAction}" class="card-link ${buttonClass}">${buttonText}</a>
            <a href="${job.url}" class="card-link btn btn-primary">Job Link</a>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item text-start bg-info">Type: ${job.job_type}</li>
        </ul>
    `;
    board.appendChild(card)
    });
}

// save jobs to an array
  function saveJob(jobId) {
     console.log(`saveJob function called with jobId: ${jobId}`);
      const job = jobsFatched.find(job => job.id === jobId);
      if (job && !savedJobs.some(savedJob => savedJob.id === job.id)) {
          savedJobs.push(job);
          localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
          const saveButton = document.querySelector(`a[onclick="saveJob(${jobId})"]`);
        saveButton.textContent = 'Remove Job';
        saveButton.className = 'card-link btn btn-danger';
        saveButton.setAttribute('onclick', `removeJob(${jobId})`)
      }
  }

  function buildSavedJobs() {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
    currentPage = 'savedJobs'; 
    board.innerHTML = '';
    
    if (savedJobs.length === 0) {
        
        board.innerHTML = '<h1>No saved jobs found.</h1>';
    } else {
        savedJobs.forEach(job => {
            const card = document.createElement('div');
            card.className = 'card'; 
            card.style.width = '22rem'; 
            card.style.marginTop = '50px'; 
            
            card.innerHTML = `
                <ul class="list-group list-group-flush">
                    <li class="list-group-item text-center bg-primary text-white" style="border-radius;1px solid black; text-decoration: underline;">
                        Company Name: ${job.company_name}
                    </li>
                </ul>
                <img id="inDivImg" src="${job.company_logo}" style='height:100px; width:100px; text-align: center;' class="card-img-top" alt="Company Logo" loading="lazy">
                <h5 class="card-title">${job.title}</h5>
                <div style="overflow-x: auto; width: 330px; height: 300px; margin-left: 10px;" class="card-body">
                    <p class="card-text fs-6 lh-1">${job.description}</p>
                </div>
                <div class="card-body">
                    <a href="#" id="removeTest" onclick="removeJob(${job.id})" class="card-link btn btn-danger">Remove Job</a>
                    <a href="${job.url}" class="card-link btn btn-primary">Job Link</a>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item text-start bg-info">Type: ${job.job_type}</li>
                </ul>
            `;
            board.appendChild(card);
        });
    }
}

             // Function to remove a job from the savedJobs array
             function removeJob(jobId) {
                savedJobs = savedJobs.filter(job => job.id !== jobId);
                
                localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
            
                const removeButton = document.querySelector(`a[onclick="removeJob(${jobId})"]`);
                if (removeButton) {
                    removeButton.textContent = 'Save Job';
                    removeButton.className = 'card-link btn btn-primary';
                    removeButton.setAttribute('onclick', `saveJob(${jobId})`);
                }
                
                if (currentPage === 'savedJobs') {
                    buildSavedJobs();
                }
            }

            buildHomePage()
 categoriestToSelect()
 fatchJobs() 
 
 
 
