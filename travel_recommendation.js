const searchRecommendation = document.getElementById('search-recommendations');
const keywords = [
  // Countries
  "Australia",
  "Japan",

  // Cities
  "Sydney",
  "Sydney, Australia",
  "Melbourne",
  "Melbourne, Australia",
  "Tokyo",
  "Tokyo, Japan",
  "Kyoto",
  "Kyoto, Japan",

  // Temples
  "Angkor Wat",
  "Angkor Wat, Cambodia",
  "Taj Mahal",
  "Taj Mahal, India",

  // Beaches
  "Bora Bora",
  "Bora Bora, French Polynesia",
  "Copacabana Beach",
  "Copacabana Beach, Brazil"
];

const createRecommendation = (name, imageUrl, description) => { 
    const recommendations = document.createElement('article'); 
    recommendations.classList.add('recommendation');  

    const recomNameSpan = document.createElement('span'); 
    recomNameSpan.classList.add('recommendation-name')
    recomNameSpan.textContent = name; 

    const recomImageArticle = document.createElement('article'); 
    recomImageArticle.classList.add('recom-image')
    recomImageArticle.style.backgroundImage = `url('${imageUrl}')`;
    recomImageArticle.style.backgroundRepeat = 'no-repeat';
    recomImageArticle.style.backgroundPosition = 'center';
    recomImageArticle.style.backgroundSize = 'cover';


    const recomDescription = document.createElement('p'); 
    recomDescription.classList.add('recommendation-description'); 
    recomDescription.textContent = description; 

    const visitBtn = document.createElement('button') 
    visitBtn.classList.add('recom-btn')
    visitBtn.textContent = 'Visit' 

    recommendations.appendChild(recomNameSpan); 
    recommendations.appendChild(recomImageArticle); 
    recommendations.appendChild(recomDescription); 
    recommendations.appendChild(visitBtn); 
  
    searchRecommendation.appendChild(recommendations); 
}


const fetchData = async () => fetch('travel_recommendation.json')
    .then(response=>response.json())
    .then(data=>{ 
        console.log(data)

        data['countries'].forEach(country => {
            const {cities} = country; 
            console.log(cities.forEach(city=>{
                const {name, imageUrl, description } = city; 
                createRecommendation(name, imageUrl, description)
            }))
        });

        data['temples'].forEach(temple=>{ 
            const { name, imageUrl, description } = temple;  
            createRecommendation(name, imageUrl, description)
        }) 

        data['beaches'].forEach(beach=>{ 
            const { name, imageUrl, description } = beach;  
            createRecommendation(name, imageUrl, description)
        })  

       
    }) 

fetchData() 



async function findRecommendation (inputString=""){  

    const words = inputString
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim()
    .split(/\s+/);    

    let recommendations = []


    await fetchData() 



    const recommendationsList = document.querySelectorAll('.recommendation'); 
 //   console.log("recoms", recommendationsList) 

    recommendationsList.forEach(recom=>{ 
        const [name, paragraph] = recom.querySelectorAll('.recommendation-name, p') 
       // console.log("Name: ", name, '\n', "paragraph: ", paragraph) 

        let count = 0;
        words.forEach(word => {
            if (name.textContent.toLowerCase().includes(word)) count++;
            if (paragraph.textContent.toLowerCase().includes(word)) count++;
        });  

        // console.log("Score: ", count, '\n', "recom:", recom)  

        recommendations.push({score: count, destination: recom})
    })


    const filteredDest = recommendations.filter(dest=> dest.score !== 0).sort((a,b)=>a.score - b.score).map(elem=>elem.destination)

    recommendationsList.forEach(recom=>{  
        console.log("Check", filteredDest.includes(recom))
        if(filteredDest.includes(recom)) recom.style.display = 'flex'; 
        else recom.style.display = 'none'
    })



    

    return words
}    



//findRecommendation("beach") 

const searchForm = document.getElementById("search-form");


searchForm.addEventListener('submit', (e)=>{ 

     e.preventDefault(); // stop the page from reloading

  const formData = new FormData(searchForm);

  // Get specific field
  const searchValue = formData.get('search');
  console.log('Submitted:', searchValue); 

  findRecommendation(searchValue)
})

