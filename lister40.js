lister40 = (function() {
  var o = { 
    armies: {}
  };

  o.addArmy = function(name, army) {
    o.armies[name] = army;
    $('#armyselect').append('<option>'+name+'</option>');
  }

  //event handler  
  $(function() {
    $('#newunitselect').change(function() {
      
    });
    $('#armyselect').change(function() {
      alert('selected: ' + $('#armyselect').val());
    });
  });
  
  return o;
})();