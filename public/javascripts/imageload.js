function loadImage(page){
 $.ajax({
  type: "GET",
  url: '/loadImg',
  data: {index:page},
  dataType: 'json',
  async : false,  
  success: function(data){
     return data;
  }
  
  });			
}

