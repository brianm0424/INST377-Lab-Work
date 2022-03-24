function restoArrayMake(arrayVar) {
  const listRange = [...Array(15).keys()];
  const finalList = listRange.map(() => {
    const randNum = Math.floor(Math.random() * arrayVar.length);
    return arrayVar[randNum];
  });
  return finalList;
}

function createHTMLList(finalList) {
  console.table(finalList);
  const restaurantList = document.querySelector('.resto-list');
  restaurantList.innerHTML = '';
  finalList.forEach((element) => {
    const inject = `<li>${element.name}</li>`;
    restaurantList.innerHTML += inject;
  });
}

async function mainEvent() { // the async keyword means we can make API requests
  const form = document.querySelector('.form-row');
  const submit = document.querySelector('.submit');
  const resto = document.querySelector('#resto_name');
  const zipcode = document.querySelector('#zipcode');

  submit.style.display = 'none';
  const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
  const arrayFromJson = await results.json(); // This changes it into data we can use - an object

  if (arrayFromJson.data.length > 0) {
    submit.style.display = 'block';

    let currentArray = [];
    resto.addEventListener('input', async(event) => {
      console.log(event.target.value);
      if (currentArray.length < 1) { return; }

      const selectResto = currentArray.filter((item) => {
        const lowerName = item.name.toLowerCase();
        const lowerValue = event.target.value.toLowerCase();
        return lowerName.includes(lowerValue);
      });
      createHTMLList(selectResto);
    });

    zipcode.addEventListener('input', async(event)=>{
      if (currentArray.length < 1) { return; }
      const selectZipcode = currentArray.filter((item) => item.zip.includes(event.target.value));

      createHTMLList(selectZipcode);
    });

    form.addEventListener('submit', async (submitEvent) => { // async has to be declared all the way to get an await
      submitEvent.preventDefault(); // This prevents your page from refreshing!
      //   console.log('form submission'); // this is substituting for a "breakpoint"

      // arrayFromJson.data - we're accessing a key called 'data' on the returned object
      // it contains all 1,000 records we need
      currentArray = restoArrayMake(arrayFromJson.data);
      createHTMLList(currentArray);
    });
  }
}

// this actually runs first! It's calling the function above
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
