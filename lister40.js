lister40 = (function() {
  function hop(o, prop) {
    return {}.hasOwnProperty.call(o, prop);
  }
  
  function strcmp(a, b) {
    return (a === b) ? 0 : (a < b ? -1 : 1);
  }
  
  function a2o(a, prop, func, context) {
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
        o[it[prop]] = func(it, context);
      } else {
        o[it[prop]] = it;
      }
    }
    return o;
  }
  
  function UnitTemplate(obj, army) {
    
      function getUpgrades(upgrades, army) {
        var i, n = (upgrades && upgrades.length) || 0, 
          result = [], up, filtered, subresult, j, m, eqi, cat, whitelisted;
        for(i = 0; i < n; ++i) {
          up = upgrades[i];
          if (up.filter) {
            filtered = {};
            m = up.filter.length;
            for(j = 0; j < m; ++j) {
              whitelisted = true;
              switch (up.filter[j].charAt(0)) {
                case '+':
                  cat = up.filter[j].substr(1);
                  break;
                case '-':
                  whitelisted = false;
                  cat = up.filter[j].substr(1);
                  break;
                default:
                  cat = up.filter[j];
              }
              for(eqi in army.equipment) {
                var matches = army.equipment[eqi].flags.indexOf(cat) !== -1;
                if (matches) {
                  filtered[eqi] = whitelisted;
                }
              }
            }
            subresult = [{name: '--- ' + up.name, points: 0, count: 0}];
            for(eqi in filtered) {
              if (filtered[eqi]) {
                subresult.push(army.equipment[eqi]);
              }
            }
            subresult.sort(function(a,b) { return strcmp(a.name, b.name); });
            result = result.concat(subresult);
          } else { //no filter
            result.push(up);
          }
        }
        return result;
      }
    
    //enfore correct usage
    if (!(this instanceof UnitTemplate)) {
      return new UnitTemplate(obj, army);
    }
    
    this.name = obj.name
    this.short = obj.short
    this.mincount = obj.mincount || 0;
    this.maxcount = obj.maxcount || 0;
    this.type = army.organization[obj.type];
    if (!this.type) {
      throw Mustache.to_html('Unit {{name}} doesn\'t have a valid type: "{{type}}"', 
      {name: this.name, type: obj.type});
    }
    this.points = obj.points || 0;
    this.troops = obj.troops || [];
    var i, n = this.troops.length;
    for(i = 0; i < n; ++i) {
      this.troops[i].upgrades = getUpgrades(this.troops[i].upgrades, army);
    }
    
    this.selects = obj.selects || [];
    this.notes = obj.notes || [];
    this.upgrades = getUpgrades(obj.upgrades, army);
  }
  
  function Unit(tmpl) {
    //enforce correct usage
    if (!(this instanceof Unit)) {
      return new Unit(obj)
    }
    
    this.id = o.nextId();
    this.tmpl = tmpl;    
    this.selects = [];
    this.troops = [];
    this.upgrades = [];
    //fill troops
    var i, n = this.tmpl.troops.length;
    for(i = 0; i < n; ++i) {
      this.troops.push({upgrades:[]});
    }
  }
  
  function Army(obj) {
    //enforce correct usage
    if (!(this instanceof Army)) {
      return new Army(obj);
    }
    
    this.organization = a2o(obj.organization, 'short');
    this.equipment = a2o(obj.equipment, 'short', 'Equipment');
    this.units = a2o(obj.units, 'short', UnitTemplate, this);
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
        html += o.addUpgradeSelector(troop.upgrades, unit.id, i, unit.troops[i].upgrades.length);
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
    
    html += o.addUpgradeSelector(unit.tmpl.upgrades, unit.id, undefined, unit.upgrades.length);
    
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
  
  o.addUpgradeSelector = function(upgrades, unitid, troopid, upgradeid) {
    var html = '', i, n = upgrades.length, id;
    //nothing to do?
    if (!n) { return []; };
    
    if (troopid !== undefined) {
      id = 'unit-'+unitid+'-troop-'+troopid+'-upgrade-'+upgradeid; 
    } else {
      id = 'unit-'+unitid+'-upgrade-'+upgradeid;
    }
    
    html += '<ul><li><select id="select-'+id+'">';
    for(i = 0; i < n; ++i) {
      var up = upgrades[i];
      html += Mustache.to_html(
        (up.count || up.points) ? 
        '<option value="{{short}}">{{name}} ({{points}} pts)</option>' :
        '<option value="{{short}}">{{name}}</option>',
        up);
    }
    
    html += '</select><input type=button id="button-'+id+'" value=add></li></ul>';
    
    //hackeldihack
    setTimeout(function() {
      $('#button-'+id).click(function(e) {
        
          function findupgrade(short, troonit, equipment) {
            return equipment[short];
          };
        
        var ids = e.currentTarget.id.split('-'),
          troonit, //troop or unit :)
          up, sel;
        sel = $('#select-' + ids.slice(1).join('-') + ' option:selected').val();
        if (ids[3] === 'troop') {
          troonit = o.list.units[ids[2]].troops[ids[4]];
        } else {
          troonit = o.list.units[ids[4]];
        }
        up = findupgrade(sel, troonit, o.army.equipment);
        console.log('adding upgrade', up, 'to unit', troonit.name);
        troonit.upgrades.push(up);
        o.updatePoints();
      })
    });
    
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
        tu, tulen,
        subtotal = tmpl.points || 0;
      //troops
      for(j = 0; j < m; ++j) {
        var num = $('#unit-'+unit.id+'-troop-'+j).val();
        subtotal += (parseInt(num, 10) || 0) * tmpl.troops[j].points;
        tu = unit.troops[j].upgrades.length;
        for(tu = 0; tu < o; ++k) {
          subtotal += unit.troops[j].upgrades[tu].points;
        }
      }
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