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
      }, 
      tmpl = o.army.units[name],
      html = '<li id="unit-'+unit.id+'">' + tmpl.type + ' - ' + name,
      i, n, j, troop
      ;
    o.list.units.push(unit);      
    
    html += ' (<span id="unit-points-'+unit.id+'"></span> pts)<br>';
    
    n = tmpl.troops.length;
    if (n > 0) {
      html += '<ul class=troop>';
      //for each troop
      for(i = 0; i < n; ++i) {
        troop = tmpl.troops[i];
        html += '<li><select class=troopselect id="unit-'+unit.id+'-troop-'+i+'">'
        for(j = (troop.mincount || 0); j <= (troop.maxcount || 20); ++j) {
          html += '<option>' + j + '</option>';
        }
        html += '</select> ' + troop.name + ' (' + troop.points + ' pts) ';
        //TODO: upgrades
        html += '</li>'
        }
      html += '</ul>';
    }
    
    html += '</li>';
    $('#list').append(html);
    $('.troopselect').change(o.updatePoints);
    o.updatePoints();
  }
  
  o.updatePoints = function() {
    var total = 0, i, n = o.list.units.length;
    for(i = 0; i < n; ++i) {
      var unit = o.list.units[i],
        tmpl = o.army.units[unit.name],
        j, m = tmpl.troops.length,
        subtotal = tmpl.points || 0;
      for(j = 0; j < m; ++j) {
        var num = $('#unit-'+unit.id+'-troop-'+j).val();
        subtotal += (parseInt(num, 16) || 0) * tmpl.troops[j].points;
        //TODO: upgrades
      };
      $('#unit-points-'+unit.id).html(subtotal);
      total += subtotal;
    };
    $('#army-points').html(total);
  };

  //event handler  
  $(function() {
    $('#armyselectbutton').click(function() {
      var name = $('#armyselect').val(),
        i, sel = $('#newunitselect');
      o.army = o.armies[name];
      o.list = {_nextid: 0, units: []};
      sel.html('');
      $('#army-points').html('0');
      if (!o.army) return;
      
      for(i in o.army.units) {
        var unit = o.army.units[i];
        sel.append('<option>' + unit.type + ' - ' + unit.name + '</option>');
      }
      
      o.updatePoints();
    });
    
//    $('#newunitselect').change(function() {
//      o.addUnit($('#newunitselect').val().split(' - ')[1]);  
//    });
    $('#newunitbutton').click(function() { 
      o.addUnit($('#newunitselect').val().split(' - ')[1]);
    });
    
    $('#armyselectbutton').click();
  });
  
  return o;
})();