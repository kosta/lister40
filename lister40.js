lister40 = (function() {
  function hop(o, prop) {
    return {}.hasOwnProperty.call(o, prop);
  }
  
  function a2o(a, prop, func) {
    var i, n = a.length, o = {}, it,
      funcname = (func instanceof Function) ? func.name : func;
    for(i = 0; i < n; ++i) {
      it = a[i];
      if (!hop(it, prop)) {
        throw Mustache.to_html(
          'a2o: obj type "{{type}}" doesn\'t have property "{{prop}}" (at idx {{idx}})',
          {type: funcname, prop: prop, idx: i});
      }
      if (hop(o, it[prop])) {
        throw Mustache.to_html(
        'a2o: obj type "{{type}}": {{prop}}: "{{val}}", name: "{{name}}" already defined ' +
        'as name: "{{exname}}" (at idx {{idx}})',
        {type: funcname, idx: i, prop: prop, val: it[prop], name: it.name, exname: o[it[prop]].name});
      }
      if (func instanceof Function) {
        o[it[prop]] = func(it);
      } else {
        o[it[prop]] = it;
      }
    }
    return o;
  }
  
  function UnitTemplate(obj) {
    //enfore correct usage
    if (!(this instanceof UnitTemplate)) {
      return new UnitTemplate(obj);
    }
    
    this.name = obj.name
    this.short = obj.short
    this.mincount = obj.mincount || 0;
    this.maxcount = obj.maxcount || 0;
    this.type = o.armyInConstruction.organization[obj.type];
    if (!this.type) {
      throw Mustache.to_html('Unit {{name}} doesn\'t have a valid type: "{{type}}"', 
      {name: this.name, type: obj.type});
    }
    this.points = obj.points || 0;
    this.troops = obj.troops || [];
    this.selects = obj.selects || [];
    this.notes = obj.notes || [];
    this.upgrades = obj.upgrades || [];
  }
  
  function Unit(tmpl) {
    //enforce correct usage
    if (!(this instanceof Unit)) {
      return new Unit(obj)
    }
    
    this.id = o.nextId();
    this.selects = [];
    this.troops = [];
    this.tmpl = tmpl;    
  }
  
  function Army(obj) {
    //enforce correct usage
    if (!(this instanceof Army)) {
      return new Army(obj);
    }
    
    //dirty hack - sorry about that
    o.armyInConstruction = this;
    
    this.organization = a2o(obj.organization, 'short');
    this.equipment = a2o(obj.equipment, 'short', 'Equipment');
    this.units = a2o(obj.units, 'short', UnitTemplate);
    
    delete o.armyInConstruction;
  }
  
  var o = { 
    armies: {}
  };

  o.addArmy = function(name, obj) {
    var army = new Army(obj);
    o.armies[name] = army;
    $('#armyselect').append('<option>'+name+'</option>');
  }
  
  o.nextId = function() {
    //if o or list are not defined, we're screwed anyway :)
    return o.list._nextid++;
  }
  
  o.addUnit = function(short) {
    var unit = new Unit(o.army.units[short]),
      html,i, n, j, m, troop;
    o.list.units[unit.id] = unit;      
    
    html = Mustache.to_html(
      '<li id="unit-{{id}}"> {{type}} - {{name}}' +
      '(<span id="unit-points-{{id}}"></span> pts)' + 
      ' - <input class=removeunit type=button value=remove id="unit-remove-{{id}}"><br>', 
      {id: unit.id, type: unit.tmpl.type.name, name: unit.tmpl.name});
    
    //selects
    n = unit.tmpl.selects.length;
    if (n > 0) {
      html += '<ul class=select>';
      for(i = 0; i < n; ++i) {
        html += "<li>" + unit.tmpl.selects[i].name + ": ";
        m = unit.tmpl.selects[i].select.length;
        //add the first selection entry to the unit
        unit.selects.push(0);
        html += '<select class=selectselect id="unit-'+unit.id+'-select-'+i+'">';
        for(j = 0; j < m; ++j) {
          var sel = unit.tmpl.selects[i].select[j];
          html += '<option>'+ sel.name + ' (' + sel.points + ' pts)</option>'
        }
        html += '</select>';
        html += "</li>";
      }
      
      html += '</ul>';
    }
    
    //troops
    n = unit.tmpl.troops.length;
    if (n > 0) {
      html += '<ul class=troop>';
      //for each troop
      for(i = 0; i < n; ++i) {
        troop = unit.tmpl.troops[i];
        html += '<li><select class=troopselect id="unit-'+unit.id+'-troop-'+i+'">'
        for(j = (troop.mincount || 0); j <= (troop.maxcount || 20); ++j) {
          html += '<option>' + j + '</option>';
        }
        html += '</select> ' + troop.name + ' (' + troop.points + ' pts) ';
        html += o.addUpgrades(unit, i);
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
    n = unit.tmpl.notes.length;
    if (n > 0) {
      html += '<ul>';
      for(i = 0; i < n; ++i) {
        html += '<li>' + unit.tmpl.notes[i] + '</li>'
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
  
  o.addUpgrades = function(unit, i) {
    //TODO: fixme
    return '';
    
    var upgrades = (i >= 0) ? tmpl.troops[i].upgrades : tmpl.upgrades,
      id, j, 
      html = '',
      m = (upgrades && upgrades.length) || 0;
    if (!m) { console.log('bye'); return};
    
    if (i >= 0) {
      id = 'unit-'+unit.id+'-troop-'+tmpl.troops[i].id+'-upgrade-'+i; 
    } else {
      id = 'unit-'+unit.id+'-upgrade-'+i;
    }
    
    html += '<li><select id="select-'+id+'">';
    var gear = [];
    for(j = 0; j < m; ++j) {
      var up = upgrades[j];
      if (up.filter) {
      } else {
        gear.push(up);
      }
    }
    m = gear.length;
    for(j = 0; j < m; ++j) {
      html += '<option value="'+gear[j].id+'">' + 
        gear[j].name + '(' + gear[j].points + ' pts)</option>';
    }
    html += '</select><input type=button id="button-'+id+'" value=add></li>';
    
    return html;
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
        tmpl = unit.tmpl,
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
      $('#list').empty();
      $('#army-points').html('0');
      if (!o.army) return;
      
      for(i in o.army.units) {
        var unit = o.army.units[i];
        sel.append(Mustache.to_html(
          '<option value="{{short}}">{{type}} - {{name}}</option>', 
          {short: unit.short, type: unit.type.short, name: unit.name}));
      }
      
      o.updatePoints();
    });
    
    $('#newunitbutton').click(function() { 
      o.addUnit($('#newunitselect').val());
    });
    
    $('#armyselectbutton').click();
  });
  
  return o;
})();