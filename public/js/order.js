

const tabs = document.querySelectorAll('[data-tab-target]')
const collection = document.querySelector('#category_collection')
const tabContents = document.querySelectorAll('[data-tab-content]')
const returnCat = document.querySelectorAll('#returnBtn')
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.tabTarget)
    tabContents.forEach(tabContent => {
      tabContent.classList.remove('active')
    })
    collection.classList.remove('active')
    tab.classList.add('active')
    target.classList.add('active')
  })
})
returnCat.forEach(cat=>{
  cat.addEventListener('click',()=>{
    tabContents.forEach(tabContent => {
      tabContent.classList.remove('active')
    })
    collection.classList.add('active')
  })
})
showTimeSelection = () =>{
  document.getElementById('timeCollectionWindow').style.display = "block";
}
// $(document).ready(function(){
//   $('input.timepicker').timepicker({
//     timeFormat: 'h:mm',
//     interval: 60,
//     minTime: '10',
//     maxTime: '6:00pm',
//     defaultTime: '11',
//     startTime: '10:00',
//     dynamic: false,
//     dropdown: true,
//     scrollbar: true
//   });
// });

(function($) {
  $(function() {
      $('#timepicker').timepicker();
  });
})(jQuery);