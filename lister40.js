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
        name: name,
        selects: []
      }, 
      tmpl = o.army.units[name],
      html = '<li id="unit-'+unit.id+'">' + tmpl.type + ' - ' + name,
      i, n, j, m, troop
      ;
    o.list.units[unit.id] = unit;      
    
    html += ' (<span id="unit-points-'+unit.id+'"></span> pts)';
    
    html += ' - <input class=removeunit type=button value=remove id="unit-remove-'+unit.id+'"><br>';
    
    //selects
    n = (tmpl.selects && tmpl.selects.length) || 0;
    if (n > 0) {
      html += '<ul class=select>';
      for(i = 0; i < n; ++i) {
        html += "<li>" + tmpl.selects[i].name + ": ";
        m = tmpl.selects[i].select.length;
        //add the first selection entry to the unit
        unit.selects.push(0);
        html += '<select class=selectselect id="unit-'+unit.id+'-select-'+i+'">';
        for(j = 0; j < m; ++j) {
          var sel = tmpl.selects[i].select[j];
          html += '<option>'+ sel.name + ' (' + sel.points + ' pts)</option>'
        }
        html += '</select>';
        html += "</li>";
      }
      
      html += '</ul>';
    }
    
    //troops
    n = (tmpl.troops && tmpl.troops.length) || 0;
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
        //notes
        m = (troop.notes && troop.notes.length) || 0;
        if (m > 0) {
          html += '<ul class=unitnotes>';
          for(j = 0; j < m; ++j) {
            html += '<li>' + troop.notes[j] + '</li>';
          }
          html += '</ul>';
        }
        html += '</li>';
        }
      html += '</ul>';
    }
    
    //notes
    n = (tmpl.notes && tmpl.notes.length) || 0;
    if (n > 0) {
      html += '<ul>';
      for(i = 0; i < n; ++i) {
        html += '<li>' + tmpl.notes[i] + '</li>'
      }
      html += '</ul>';
    }
    
    html += '</li>';
    $('#list').append(html);
    $('.troopselect').change(o.updatePoints);
    $('.selectselect').change(o.selectChanged);
    $('.removeunit').click(o.removeUnit);
    o.updatePoints();
  }
  
  o.selectChanged = function(e) {
    var split = e.currentTarget.id.split('-'),
      unitid = split[1],
      selectid = split[3],
      unit = o.list.units[unitid];
    unit.selects[selectid] = e.currentTarget.selectedIndex;
    
    o.updatePoints();
  }
  
  o.removeUnit = function(e) {
    var unitid = e.currentTarget.id.split('-')[2];
    $('#unit-'+unitid).remove();
    delete o.list.units[unitid];
    o.updatePoints();
  }
  
  o.updatePoints = function() {
    var total = 0, i, n = o.list.units.length;
    for(i in o.list.units) {
      var unit = o.list.units[i],
        tmpl = o.army.units[unit.name],
        j, 
        m = (tmpl.troops && tmpl.troops.length) || 0,
        subtotal = tmpl.points || 0;
      //troops
      for(j = 0; j < m; ++j) {
        var num = $('#unit-'+unit.id+'-troop-'+j).val();
        subtotal += (parseInt(num, 10) || 0) * tmpl.troops[j].points;
        //TODO: troop upgrades
      };
      //selects
      m = unit.selects.length;
      for(j = 0; j < m; ++j) {
        subtotal += tmpl.selects[j].select[unit.selects[j]].points;
      }
      //unit upgrades
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
    
    $('#newunitbutton').click(function() { 
      o.addUnit($('#newunitselect').val().split(' - ')[1]);
    });
    
    $('#armyselectbutton').click();
  });
  
  return o;
})();