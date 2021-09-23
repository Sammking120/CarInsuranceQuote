//Variables
const form =document.getElementById('request-quote');
const html = new HTMLUI();

//EventListers
addEventListeners();

function addEventListeners(){

  document.addEventListener('DOMContentLoaded', function(){
    //Create the <option> for the year </option>
       
        html.displayYears();
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();

      //Read the Value from the FORM 
      const make = document.getElementById('make').value;
      const year =document.getElementById('year').value;

      //Read the radio Button
      const level = document.querySelector('input[name="level"]:checked').value;

      //Check that all fields have Something
      if(make === "" || year === "" || level === ""){
        html.displayError("All the field are Mandatory")
      }else{

          //make the quotation
          const insurance = new Insurance(make, year,level);
          const price = insurance.calculateQuotation(insurance);
          html.showResults(price, insurance);

        //clear the Previous Quotation
        const prevResult = document.querySelector('#result div');
        if(prevResult != null){
          prevResult.remove();
        }


      
      }
    });
}




//Objects
//Objects Takes everything related to the Quotation and Calculation
function Insurance(make, year, level){
  this.make = make;
  this.year = year;
  this.level= level;

}
//Function that Calculate for the price for the current Quotation;
Insurance.prototype.calculateQuotation = function(insurance){
let price;
const base = 2000;

//get the Make
const make = insurance.make;

/* 
The ratio of how the prices are supposed to increase depending on the make.
   1 = American 15%
   2 = Asian 5%
   3 = European 35%
*/

    switch(make){
      case '1':
        price = base * 1.15;
        break;
      case '2':
          price = base * 1.05;
          break;
      case '3':
        price = base * 1.35;
        break;
      
    }

    //Get the Year
    const year = insurance.year;
    const difference = this.getYearDifference(year);

    //Each Year the cost of the Insurance is going to be 3% cheaper
    price = price - ((difference * 3) * price) /100;

    const level = insurance.level;
    price = this.calculateLevel(price,level);

    return price;


}

// Adds the value Based on the level of the Protection
Insurance.prototype.calculateLevel = function(price, level){
/* 
    Basic insurance is going to increase by 30%
    Complete Insurance is going to increase by 50%
    */
  
    if (level === 'basic'){
      price = price*1.30;
    }else{
      price = price * 1.50;
    }
    return price;

}

//Returns the Difference beteween Years
Insurance.prototype.getYearDifference= function (){

  return new Date().getFullYear() -this.year;

}





//The Oject takes anything on the related to UI
function HTMLUI(){}

//Display the latest 20 years in the Select
HTMLUI.prototype.displayYears = function(){
  //Max and Minimum Years
  const max = new Date().getFullYear();
        min = max-20;
  
        //Generate the List with the lastest 20years
        const selectYears = document.getElementById('year');

        //print The value
        for(let i = max; i >= min; i--){
          const option = document.createElement('option');
          option.value = i;
          option.textContent = i;
          selectYears.appendChild(option);
        }
} 

HTMLUI.prototype.displayError= function(message){
  
  //create a div
const div =document.createElement('div');
div.classList = 'error';

//Insert the Message
div.innerHTML = `
  <p>${message}</p>
`
form.insertBefore(div, document.querySelector('.form-group'))
   
//Remove the Error
setTimeout(function(){
  document.querySelector('.error').remove();
}, 3000);
}


//Prints the results into the HTML
HTMLUI.prototype.showResults = function(price, insurance){
//Print the result
const result = document.getElementById('result');

//Create a div with the result 
const div = document.createElement('div')

//Get Make from the Object and assign a readable name
let make = insurance.make;

switch(make){
  case '1':
    make = 'American'
    break;
  case '2':
    make = 'Asian'
    break;
  case '3':
    make = 'European'
    break;
}
// console.log(make)

//Insert the Results
div.innerHTML=
`<p class = "header">Summary</p>
<p> Make: ${make}</p>
<p> Year: ${insurance.year}</p>
<p>Level: ${insurance.level}</p>
<p class="total">Total: Ksh ${price.toFixed(2)}</p>

`;
//Display the Spinner
const spinner = document.querySelector("#loading img");
spinner.style.display ='block';

setTimeout (function(){
  spinner.style.display ='none';
  //Insert this into the  hHTML
  result.appendChild(div);

},3000);
  

}