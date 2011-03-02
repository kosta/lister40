lister40 = (function() {
  var o = { 
    armies: {}
  };

  o.addArmy = function(name, army) {
    o.armies[name] = army;
    $('#armyselect').append('<option>'+name+'</option>');
  }
  
  o.addUnit = function(name) {
    alert('adding ' + name);
  }

  //event handler  
  $(function() {
    $('#armyselect').change(function() {
      var name = $('#armyselect').val(),
        i, sel = $('#newunitselect');
      o.army = o.armies[name];
      sel.html('');
      if (!o.army) return;
      
      for(i in o.army.units) {
        var unit = o.army.units[i];
        sel.append('<option>' + unit.type + ' - ' + unit.name + '</option>');
      }
    });
    
    $('#newunitselect').change(function() {
      o.addUnit($('#newunitselect').val().split(' - ')[1]);  
    });
    $('#newunitform').submit(function() { 
      try {
        o.addUnit($('#newunitselect').val().split(' - ')[1]);
      } catch (e) {
        if (console && console.log) {
          console.log(e);
        }
      } finally {
        return false;
      }      
    });
  });
  
  return o;
})();