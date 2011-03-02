lister40 = (function() {
  var o = { 
    armies: {}
  };

  o.addArmy = function(name, army) {
    o.armies[name] = army;
    var units = {}, i, n = army.units.length;
    for(i = 0; i < n; ++i) {
      units[army.units[i].name] = army.units[i];
    }
    army.units = units;
    $('#armyselect').append('<option>'+name+'</option>');
  }
  
  o.nextId = function() {
    //if o or list are not defined, we're screwed anyway :)
    return o.list._nextid++;
  }
  
  o.addUnit = function(name) {
    var unit = {
      id: o.nextId(),
      name: name
    }, tmpl = o.army.units[name];
    
    o.list.units.push(unit);
    $('#list').append('<li id="unit-'+unit.id+'">' + tmpl.type + ' - ' + name + '</li>');
  }

  //event handler  
  $(function() {
    $('#armyselectbutton').click(function() {
      var name = $('#armyselect').val(),
        i, sel = $('#newunitselect');
      o.army = o.armies[name];
      o.list = {_nextid: 0, units: []};
      sel.html('');
      if (!o.army) return;
      
      for(i in o.army.units) {
        var unit = o.army.units[i];
        sel.append('<option>' + unit.type + ' - ' + unit.name + '</option>');
      }
    });
    
//    $('#newunitselect').change(function() {
//      o.addUnit($('#newunitselect').val().split(' - ')[1]);  
//    });
    $('#newunitbutton').click(function() { 
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
    
    $('#armyselectbutton').click();
  });
  
  return o;
})();