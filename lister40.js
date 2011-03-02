lister40 = (function() {
  var o = { 
    armies: {}
  };

  o.addArmy = function(name, army) {
    o.armies[name] = army;
    $('#armyselect').append('<option>'+name+'</option>');
  }

  return o;
})();