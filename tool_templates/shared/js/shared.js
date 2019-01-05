(function(){
  console.log("shared service running!");
  var app = angular.module("pictureShow");
  app.service("CoStars",["$timeout",function($timeout){

    this.get_device_size = function(xtr)
    {
      let boss = this;
      //let screen_width = document.body.clientWidth;
      let screen_width = window.innerWidth;
      let extra = xtr || false;

      //seems off by 16
      let sm = 480;//464;
      let md = 768;//752
      let lg = 992;
      let device_size = (screen_width < sm) ? "small" :
      (screen_width >= sm && screen_width < md) ? "medium" :
      (screen_width >= md && screen_width < lg) ? "large" :
      "xlarge";
      boss.device_size = (extra === false && device_size == "xlarge") ? "large" : device_size;
      return device_size;
    }//get_device_size

    this.select_image_ndx = function(iObj)
    {
      let boss = this;
      //determine the view //
      let size_ary = {small:"mobile",medium:"tablet",large:"desktop",xlarge:"max"}
      let device_size = boss.get_device_size();
      //if its active change the view
      let active_view =  (boss.mode == "admin") ? boss.view : size_ary[device_size];
      let active_ndx = 0;

      // look through img_obj array and find any image with an active_mobile label
      let test_ndx = iObj.img_obj.findIndex(function(entry,ndx)
      {
        return active_view == "mobile" && boss._.exists(entry.mobile) &&  entry.mobile == "on";

      });

      return (test_ndx != undefined && test_ndx != -1) ? test_ndx : active_ndx;


    }//select_image_ndx


    this.getAssets = async function()
    {
      //i need getAssets to run later
      let boss = this;

      let trans = {};
      trans.task = "getAssets";
      let convert_array = [];
      if(typeof boss._.data_ids != "string")
      {
        //hack for .data_ids.join  is not a function
        //https://stackoverflow.com/questions/1424710/why-is-my-join-on-a-javascript-array-failing
        for(let i = 0; i < boss._.data_ids.length; i++){
          convert_array.push(boss._.data_ids[i]);
        }
        trans.data = convert_array.join();
      }else {
        trans.data = boss._.data_ids;
      }

      if(trans.data == "") return;

      await boss._.request(trans)
      .then(function(results)
      {
        //console.log("places results = ",results);
        if(results != "error"){

          boss._.asset_info = results;

          //console.log("tool_data = ",boss._.asset_info);
        }
        //$scope.$apply();
      }).catch(function(err)
      {
        //console.log(`psmod_app getData error ${err}`);
      });

      //console.log("getAssets finished running!");

      return;
    }//getAssets


    this.update_assets = function(dIDs)
    {
      let boss = this;

      let comp_ids = [];
      dIDs.forEach(function(entry){
        if(boss._.asset_reference[entry] != undefined){
          comp_ids.push(boss._.asset_reference[entry]);
        }//end if
      });
      return comp_ids;
    }// update_assets


    this.weedOut = function(str,srch,qSel)
    {
      /*this function takes out unwanted css classes from the elements classNames by referencing
      an array of possible unwanted strings*/
      let boss = this;

      let targ_str = str;
      let targ_ary = str.split(" ");//take the classname str & make an array
      let weedAry = [];
      let srch_ary = (typeof srch == "string") ? [srch] : srch;
      let scratchy = (qSel != undefined) ? document.querySelector(qSel) : "default";

      targ_ary.forEach(function(entry)
      {
        let not_in_array = true;
        srch_ary.forEach(function(sentry)
        {
          //i need a while to clear multiple instances of the srch term
          if(entry.indexOf(sentry) != -1 && entry != "")
          {
            not_in_array = false;
          }
          });

          if(not_in_array == true){
            //make sure its not already in weedAry
            let not_in_here = true;
            weedAry.forEach(function(checka){
              if(checka == entry)
              {
                not_in_here = false;
              }//end if
            });
            if(not_in_here == true){
              weedAry.push(entry);//if isn't found in the srch array push into the final array
            }//end if
          }else {
            if(scratchy != "default"){
              //scratchy.className = scratchy.className.replace(entry,"");
              scratchy.className = scratchy.className.replace(new RegExp(entry, 'g'),"");
            }//end if
          }//end else

      });

      //when im done clean it up
      if(scratchy != "default"){
        scratchy.className = boss._.removeSomething(scratchy.className,' ');
      }//end if
      return weedAry.join(" ");
    }//weedOut

    this.setLinkHover = function(eID,dest)
    {
      // manualSlideshow and blogModule
      let boss = this;

      let targ_str = `.read_more_${boss.iUN}_${eID}`;
      let targ_el = document.querySelector(targ_str);
      if(!targ_el) return;
      targ_el.addEventListener("mouseenter",function(){
        targ_el.style.backgroundColor = `${boss._.tool.views[boss.view][dest].bg_hov_hex}`;
        targ_el.style.color = `${boss._.tool.views[boss.view][dest].font_hov_color}`;
      });
      targ_el.addEventListener("mouseleave",function(){
        targ_el.style.backgroundColor = `${boss._.tool.views[boss.view][dest].bg_hex}`;
        targ_el.style.color = `${boss._.tool.views[boss.view][dest].font_color}`;
      });
    }//setLinkHover

    this.image_object_converter = function(cpar)
    {
      let boss = this;

      let data = cpar;
      if(data.img_obj[0] == undefined)
      {
        let temp_obj = boss._.bboy(data.img_obj);
        data.img_obj = [];
        data.img_obj[0] = (boss._.exists(temp_obj)) ? temp_obj : {} ;
        data.img_obj[0].url = data.url;

        if(boss._.exists(data.canvas))
        {
          data.img_obj[0].canvas = boss._.bboy(data.canvas);
        }//if
      }//if

      return data;

    }//image_object_converter


    this.process_size = function()
    {
      let boss = this;

      if(boss.mode == "admin"){
        //i can use an admin mode if i need it
        //console.log("mode=",boss.mode);
        //console.log("crew=",unescape(boss.crew));

        //get the sceen dimensions
        let s_w = parseInt(boss.screen_width);//* .8 gives me the size of the showcase
        let s_h = parseInt(boss.screen_height);

        let get_screen_ratio = boss.get_ratio(s_w,s_h);
        let screen_ratio = get_screen_ratio.split(":");
        let s_w_ratio = screen_ratio[0];
        let s_h_ratio = screen_ratio[1];
        //let h_screen_pct =

        //i need to conver s_h into s_w units of measurement

        //get the custom dimensions
        let c_w = boss._.tool.views[boss.view].width;
        let c_h = boss._.tool.views[boss.view].height;//this is the user set dimensions

        let auto_width = boss._.tool.views[boss.view].auto_width;
        //let width_pct = parseFloat("." + boss._.tool.views[boss.view].width_pct);
        let width_pct = boss._.tool.views[boss.view].width_pct;

        let orient = (c_w == c_h) ? "square" : (c_w > c_h) ? "landscape"  : "portrait";

        let is_responsive = boss.responsive;
        //console.log("process_size responsive = ",boss.responsive);

        //if responsive or if <= use the responsive classes
        //process width
        if(is_responsive == 1)
        {
          //if(c_w <= s_w && c_h <= s_h ) use the ratio if its bigger than the page
          //if its bigger than the screen height - use c_h to s_h
          boss._.tool.views[boss.view].ratio = boss.get_ratio(c_w,c_h);
          let the_ratio = boss._.tool.views[boss.view].ratio.split(":");
          let w_ratio = the_ratio[0];
          let h_ratio = the_ratio[1];

          //get % of screen width

          let w_pct,h_pct;
          switch(orient)
          {
            case "square":

            w_pct = width_pct;

            h_pct = w_pct;
            break;

            case "portrait":
            //right now he purpose is for displays that fit in the viewport window.
            //i need the s|c_h converted into screen width measurements - the h is naturally x s|c_w
            //then i want to know what % of the available h the users wants to use
            h_pct = (c_w <= s_w) ? c_h / s_w : c_h / c_w;
            h_pct = (h_pct > .95) ? .95 : h_pct;//make sure it doesn't exceed 95

            w_pct = width_pct;
            break;

            case "landscape":

              w_pct = width_pct;

              h_pct = w_pct / w_ratio;
            break;
          }//switch

          let w_nbr = w_pct;//boss.rounded();
          let w_class = " d3S_pw" + w_nbr;//" d3S_w" + w_nbr;
          let h_nbr = boss.rounded(h_pct);
          let h_class = "d3S_ph" + h_nbr;// "d3S_h" + h_nbr;

          let samp_w_nbr = w_pct;//parseInt(boss.rounded());// * .80
          let samp_w_class = " d3S_pw" + samp_w_nbr;// " d3S_w" + samp_w_nbr;
          let samp_h_nbr = parseInt(boss.rounded(h_pct  * .60));
          let samp_h_class = "d3S_ph" + h_nbr;//"d3S_h" + samp_h_nbr;

          boss._.tool.views[boss.view].w_class = w_class;
          boss._.tool.views[boss.view].h_class = h_class;
          boss._.tool.views[boss.view].w_nbr = w_nbr;
          boss._.tool.views[boss.view].h_nbr = h_nbr;
          boss._.tool.views[boss.view].samp_w_class = samp_w_class;
          boss._.tool.views[boss.view].samp_h_class = samp_h_class;
          boss._.tool.views[boss.view].samp_w_nbr = samp_w_nbr;
          boss._.tool.views[boss.view].samp_h_nbr = samp_h_nbr;

          boss._.tool.views[boss.view].class_style = " " + w_class + " ";
          boss._.tool.views[boss.view].class_alt = " " + samp_w_class + " ";

          let custom_class = " " + boss._.tool.views[boss.view].class_pfx + " " + boss._.tool.views[boss.view].class_style + " ";
          custom_class = boss._.removeSomething(custom_class,' ');
          let sample_class = " " + boss._.tool.views[boss.view].class_pfx + " " + boss._.tool.views[boss.view].class_alt + " ";
          sample_class = boss._.removeSomething(sample_class,' ');

          boss._.tool.views[boss.view].custom_class = custom_class;
          boss._.tool.views[boss.view].sample_class = sample_class;

          let custom_style = `min-height:${boss._.tool.views[boss.view].height}px !important`;
          let sample_style = `min-height:${boss._.tool.views[boss.view].height}px !important`;
          boss._.tool.views[boss.view].custom_style = "";//custom_style;
          boss._.tool.views[boss.view].sample_style = "";//sample_style;


          //console.log("class style = ",boss._.tool.views[boss.view].class_style);
          //console.log("class alt = ",boss._.tool.views[boss.view].class_alt);
        }else {
          boss._.tool.views[boss.view].custom_class = "";
          boss._.tool.views[boss.view].sample_class = "";
        }
        //end if boss.mode
        boss.outer_style();

        boss._.refresh_tool = "true";
      }

    }//process_size


    this.get_ratio = function(w,h)
    {
      let boss = this;

      let ratio;
      if(w == h){
        ratio = "1:1";
      }else if(w > h){
        calc = w / h;
        ratio = calc + ":1";
      }else {
        calc = h / w;
        ratio = "1:" + calc;
      }

      return ratio;
    }//get_ratio


    this.rounded = function(nbr,mod)
    {
      //sample: boss.rounded(h_pct,"fives");//rounds to the nearest 5
      let boss = this;

      let mode = mod || "default";
      let targ = nbr * 100;
      let test_nbr;
      targ = targ.toFixed(2);
      //isolate the 1's place #
      targ_floor = Math.floor(parseInt(targ)/10) * 10;
      let e_nbr = targ - targ_floor;
      switch(mode)
      {
        case "fives":

        //i dont want to go bigger
        if(e_nbr == 5){
          //if its a 5 use the number as is
          pct = Math.floor(targ);
        }else if(e_nbr > 5){
          //if greater than 5
          test_nbr = e_nbr - 5;
          if(test_nbr >= 2.5){
            pct = targ_floor + 10;
          }else{
            pct = targ_floor + 5;
          }//end else
        }else {
          //less than 5
          test_nbr = 5 - e_nbr;
          if(test_nbr <= 2.5){
            pct = targ_floor + 5;
          }else{
            pct = targ_floor;
          }//end else
        }//end else
        break;
        default:
          pct = Math.round(targ);
        break;
      }
      //console.log("pct = ",pct);
      return pct;
    }//rounded

    this.prep_color = async function(mod,dest,param)
    {
      let boss = this;

      if(event== undefined)return;
      let targ_el = event.target;
      boss.prep_color2(targ_el.value,mod,dest,param)
      //return arguments.length ? (_name = newName) : _name;//I like this shortcut
    }//prep_color

    //hack for color.ctrlr.js
    this.prep_color2 = async function(val,mod,dest,param)
    {
      let boss = this;

      //i need to compile the new color
      await boss.form_item_color(val,mod,dest,param);
      boss.form_item_style(dest);
      //$scope.$digest();

      //return arguments.length ? (_name = newName) : _name;//I like this shortcut
    }//prep_color

    this.prep_height = async function(dest,cls)
    {
      let boss = this;
      let targ_el = event.target;
          //i need to compile the new color
          await boss.form_btn_height(targ_el.value,dest,cls);
          //boss.form_item_style();
          $timeout(function(){},0,true);

      //return arguments.length ? (_name = newName) : _name;//I like this shortcut
    }//prep_height

    this.form_btn_height = function(dat,dest,cls)
    {
      // shared by blogMod & menus
      let boss = this;

      //what if its empty or brand new and angular is just digesting?
      if(dat == undefined && dest == undefined && cls == undefined ||
      dest == undefined && cls == undefined) return;

      let active_width = boss._.tool.views[boss.view][dest].active_width;
      if(dat == undefined || active_width === false)return;
        let btn_grp = document.querySelectorAll(".bM_read_more");
        let new_class = ` ${cls}${dat} `;

        btn_grp.forEach(function(entry){
          let dirty_class = entry.className;
          let clean_class = boss.weedOut(dirty_class,["d3_","d3S_","d3M_","d3L_","d3XL_"]);
          let class_final = clean_class + new_class;
          entry.className = boss._.removeSomething(class_final,' ');
        });

    }//form_btn_height


    this.form_item_color = function(dat,mod,dest,pref)
    {
      let boss = this;
      let pfx = pref || "bg";
      let base16_str = pfx + "_base16";
      let hex_str = pfx + "_hex";
      let color_str = pfx + "_color";

      switch(mod)
      {
          case "opacity":
            let nbr = dat;//0 - 100
            let pct = parseInt(dat,10) / 100;
            let targ_nbr = (Math.floor(255 * pct)).toString(16);
            targ_nbr = (targ_nbr.length == 1) ? "0" + targ_nbr : targ_nbr;

            boss._.tool.views[boss.view][dest][`${pfx}_base16`] = targ_nbr;
            boss._.tool.views[boss.view][dest][`${pfx}_hex`] = boss._.tool.views[boss.view][dest][`${pfx}_color`] + "" + targ_nbr;
            //boss._.tool.views[boss.view].btn_opacity = parseInt(dat,10);
          break;

          case "color":
            boss._.tool.views[boss.view][dest][`${pfx}_hex`] = dat + "" + boss._.tool.views[boss.view][dest][`${pfx}_base16`];
            boss._.tool.views[boss.view][dest][`${pfx}_color`] = dat;

            let hVal = `hex value = ${boss._.tool.views[boss.view][dest][`${pfx}_hex`]}`
            //console.log(hVal);
          break;

          /*case "text":
            boss._.tool.views[boss.view][dest][`${pref}_color`] = dat;
          break;*/
      }//end switch
    }//form_item_color

    this.make_margin = function(dest,mod,dest2)
    {
      let boss = this;
      let margin_str,margin_boxes;

      switch (dest) {
      case "all":
        let mod_str = "." + mod;
        let chkAll = document.querySelector(mod_str);
        margin_str = `.${dest2}_margin`;
        margin_boxes = document.querySelectorAll(margin_str);

        if(chkAll.checked)
        {
          margin_boxes.forEach(function(entry){
            entry.checked = true;
          });
          //boss._.tool.views[boss.view][dest].auto_same_margins = false;
        }else {
          margin_boxes.forEach(function(entry){
            entry.checked = false;
          });
          //boss._.tool.views[boss.view][dest].auto_same_margins = true;
        }
      break;

      default:
      let ready_custom = (boss.destination == undefined || boss.destination == "") ? "false" : "true";
      if(dest == "custom" && ready_custom == "false")return;
      margin_str = `.${dest}_margin_box`;
      margin_boxes = document.querySelectorAll(margin_str);
      margin_boxes.forEach(function(entry){
        if(entry.checked)
        {
          let el_param = entry.dataset.param;
            boss._.tool.views[boss.view][dest][el_param] = boss._.tool.views[boss.view][dest].margin_value;
        }
      });

      boss.form_item_style(dest);
    }//switch


    }//make_margin


    this.make_padding = function(dest,mod,dest2)
    {
      let boss = this;

      let padding_str,padding_boxes;
      let ready_custom = (boss.destination == undefined || boss.destination == "") ? "false" : "true";
      if(dest == "custom" && ready_custom == "false")return;

      switch (dest) {
      case "all":
        let mod_str = "." + mod;
        let chkAll = document.querySelector(mod_str);
        padding_str = `.${dest2}_padding`;
        padding_boxes = document.querySelectorAll(padding_str);

        if(chkAll.checked)
        {
          padding_boxes.forEach(function(entry){
            entry.checked = true;
          });
          //boss._.tool.views[boss.view][dest].auto_same_paddings = false;
        }else {
          padding_boxes.forEach(function(entry){
            entry.checked = false;
          });
          //boss._.tool.views[boss.view][dest].auto_same_paddings = true;
        }
      break;

      default:
      padding_str = `.${dest}_padding_box`;
      padding_boxes = document.querySelectorAll(padding_str);
      padding_boxes.forEach(function(entry){
        if(entry.checked)
        {
          let el_param = entry.dataset.param;
            boss._.tool.views[boss.view][dest][el_param] = boss._.tool.views[boss.view][dest].padding_value;
        }
      });

      boss.form_item_style(dest);
    }//switch

    }//make_padding


    this.make_border = function(dest,mod,dest2)
    {
      let boss = this;

      let border_str,border_boxes;

      switch (dest) {
      case "all":
        let mod_str = "." + mod;
        let chkAll = document.querySelector(mod_str);
        border_str = `.${dest2}_border`;
        border_boxes = document.querySelectorAll(border_str);

        if(chkAll.checked)
        {
          border_boxes.forEach(function(entry){
            entry.checked = true;
          });
          //boss._.tool.views[boss.view][dest].auto_same_borders = false;
        }else {
          border_boxes.forEach(function(entry){
            entry.checked = false;
          });
          //boss._.tool.views[boss.view][dest].auto_same_borders = true;
        }
      break;

      default:
      border_str = `.${dest}_border_box`;
      border_boxes = document.querySelectorAll(border_str);
      border_boxes.forEach(function(entry){
        if(entry.checked)
        {
          let el_param = entry.dataset.param;
          boss._.tool.views[boss.view][dest][el_param] = boss._.tool.views[boss.view][dest].border_width_value;
        }
      });

      boss.form_item_style(dest);
    }//switch


    }//make_border


    this.link = function(lnk)
    {
      //window.location.replace(lnk);
      window.location.href = lnk;
    }//link

    this.soft_apply = function(callout,prop,ms)
    {
      let mili = ms || 0;
      return new Promise(function(resolve, reject) {
        $timeout(function(){},mili,true).then(function(){
          if(callout != undefined && callout != ""){
            callout(prop);
            resolve();
          }else{
            resolve();
          }
        });
      });
    }//soft_apply

    this.update_view = function(fc)
    {
      let boss = this;
      return new Promise(function(resolve, reject) {

        let force = fc || false;
        let view_str = "default";
        if(boss.mode == "admin")
        {
          //if admin use dropdown
          let targ_sel_str = boss.view_select;

          //test to see if selector exists - if it does use its value, if not use default
          if(document.querySelector(`.${targ_sel_str}`)){

            let select_el = (document.querySelector(`.${targ_sel_str}`)) ? document.querySelector(`.${targ_sel_str}`) : "default";
            let select_ndx = select_el.selectedIndex;
            let accessValue = boss._.getSelectedValue(`.${targ_sel_str}`,"index_value",select_ndx);
            view_str = accessValue;
          }

        }else{
          //if its the same as the last pass through don't give it image change permission.

          let size_ary = {small:"mobile",medium:"tablet",large:"desktop",xlarge:"max"}
          let device_size = boss.get_device_size();
          //if its active change the view
          view_str = size_ary[device_size];

        }//else

          let active_view = (boss.exists(boss._.tool.views[view_str])  &&
          boss.exists(boss._.tool.views[view_str].active_view)) ? true : false;

          // if(boss.view != view_str /*&& active_view == true*/)
          // {
          //   // this section is only for the canvas_mkr - it has nothing to do
          //   // with other views in the views object
          //   boss._.refresh_tool = "true";
          // }//if

          if(boss.service.current_view != view_str)
          {
            // if the current view changes
            boss.service.current_view = view_str;
            boss._.refresh_tool = "true";
          }//if

          // if theres an active view switch to the view
          if(boss.mode == "admin" || active_view )
          {
            // boss.view = view_str;
            // boss._.view = boss.view;
            boss._.view = view_str;
            boss.soft_apply();
          }else{
            //otherwise use default
            // boss.view = "default";
            // boss._.view = boss.view;
            boss._.view = "default";
            boss.soft_apply();
          }
        resolve();
      });//promise

    }//update_view

    this.prep_custom = function(chk)
    {
      let boss = this;
      //get all custom# obj keys

      let check = chk || "all";//if i don't pass a value prep all available custom elements

      let custom_keys = [];
      let obj_keys = (check != "all") ? [check] : Object.keys(boss._.tool.views[boss.view]);
      obj_keys.forEach(function(entry)
      {
        if(entry.match(/custom\d+/g))
        {
          ///custom[0-9]/g - works but only matches 1 digit
          //filter for approved/proper properties or 'custom' pfx
          custom_keys.push(entry);
        }//if
      });

      //make sure it found something
      if(custom_keys.length < 1)return;

      //iterate and process
      custom_keys.forEach(function(dest)
      {
        let targ_obj = boss._.tool.views[boss.view][dest];
        //if it doesn't have a type, skip it
        if(targ_obj.custom_type == undefined || targ_obj.custom_type == "")return;

        let custom_type = targ_obj.custom_type;
        let targ_name = targ_obj.custom_element;
        //let targ_el = boss.get_custom_element(custom_type,targ_name);

        boss.process_custom_element(targ_obj,custom_type,targ_name,dest);


      });

    }//prep_custom

    this.process_custom_element = function(t_obj,typ,nM,dest)
    {
      // bM has a different process_custom_element mSS iM mM are the same
      //return new Promise(function(resolve, reject) {

        let boss = this;

        let type = typ;
        let name = nM || "";
        let targ_el;

        let mt = boss._.tool.module_title;
        console.log("module title = ",mt);

        switch (type) {
          case "parent":
            //save it for the front end

            //if(boss.mode == "admin") return "";
            let par_name =  boss._.tool.module_position;
            //find where the module position is kept
            targ_el = (document.getElementById(par_name)) ? document.getElementById(par_name) :
            (document.querySelectorAll(`.${par_name}`)) ? document.querySelectorAll(`.${par_name}`) : "";

            boss.parse_custom(targ_el,type,dest);
            //return (targ_el != undefined) ? targ_el : "";
            //resolve(targ_el);
          break;

          case "classname":
            //save it for the front end
            //if(boss.mode == "admin") return "";
              if(name == ""){return "";}
            //test for id and then classname
            targ_el = (document.getElementById(name)) ? document.getElementById(name) :
            (document.querySelectorAll(`.${name}`)) ? document.querySelectorAll(`.${name}`) : "";

            boss.parse_custom(targ_el,type,dest);
            //return (targ_el != undefined) ? targ_el : "";
            //resolve(targ_el);
          break;
          case "nested":

            boss.soft_apply("","",300)
            .then(function(){

              boss.soft_apply()
              .then(function(){

                boss.delay_nested({t_obj,type,dest})
              });

            });
          break;

        }//switch
      //});//promise
    }//process_custom_element

    this.delay_nested = function(nest)
    {
      //split the string
      //if(name == ""){return "";}
      let boss = this;
      let t_obj = nest.t_obj;
      let type = nest.type;
      let dest = nest.dest;


      let name_arry = name.split(" ");
      let section_target = t_obj.nested_parent || "";//name_arry[0];
      let element_target = t_obj.nested_element || ""//name_arry[1];


      //test against a list of options
      /*
      let in_nest_array = boss._.valueChecker({"array":boss.nest_properties,
      "string":section_target,"mod":"index","type":"sna","action":"match"});
      let in_child_array = boss._.valueChecker({"array":boss.child_elements,
      "string":element_target,"mod":"index","type":"sna","action":"match"});
      */

      //make sure they are both valid
      //if(in_nest_array[0] != -1 && in_child_array[0] != -1)
      if(section_target != "" && element_target != "")
      {
        //get preformatted name from section_target object for example:
        //title:`.${boss.el_pfx}_head_html_${boss.iUN}`
        let targ_str = boss.section_objects[section_target];

        //call the parent target
        let collection = document.querySelectorAll(targ_str);

        //get a list of targeted child elements
        if(collection.length > 0)
        {

          //section for dealing with an array
          for(let i = 0; i < collection.length; i++)
          {
            let targ_el = collection[i].getElementsByTagName(element_target);
            boss.parse_custom(targ_el,type,dest);
          }
        }
        //return (targ_el != undefined) ? targ_el : "";
        //resolve(targ_el);

      }else{
        return "";
      }
    }//delay_nested


    this.parse_custom = function(targ_el,custom_type,dest)
    {
      let boss = this;

      if(targ_el != undefined && targ_el != "" && typeof targ_el == "object")
      {
          if(targ_el[0] != undefined)
          {
            //section for dealing with an array
            for(let i = 0; i < targ_el.length; i++)
            {
              boss.customize(targ_el[i],custom_type,dest);
            }//for
          }else if(targ_el.length == undefined){
            //section for dealing with a single object
              boss.customize(targ_el,custom_type,dest);
          }//else
      }//if
    }//parse_custom

    this.customize = function(targ_el,type,dest)
    {
      let boss = this;
      let chk_str = targ_el.className;
      let new_class = boss.weedOut(chk_str,boss.outer_array);
      let target_detail = boss._.tool.views[boss.view][dest];//(dest.match(/custom\d+/g)) ? :
      let active_style = (target_detail[`active_${dest}`] != undefined) ? target_detail[`active_${dest}`] :
      (target_detail.active_style != undefined) ? target_detail.active_style :  false;

      targ_el.className = boss._.removeSomething(new_class,' ');


      //get class
      //im trying to prevent the class addons from being repeated with each digest
      let calc_class = (active_style == true) ? boss.getClass(dest) : "";
      targ_el.className.replace(calc_class,"");

      targ_el.className = (active_style == true) ?
      ` ${targ_el.className} ${calc_class} ` : targ_el.className;


      //get style
      let font_style = boss._.tool.views[boss.view][dest].font_style || false;
      let height_control = boss._.tool.views[boss.view][dest].height_control || false;
      let simple_style = (active_style == true) ? boss.style_obj(dest) : "";
      let txt_style = "";

      if(type == "nested")
      {
        txt_style = (active_style == true && font_style == true) ? boss.getTextStyle(boss._.tool.views[boss.view][dest],dest) : "";
      }else if(height_control == true){
        txt_style = boss.getHeight(dest);
      }

      let new_style = `${simple_style} ${txt_style}`;
      targ_el.style = boss._.removeSomething(new_style,' ');
      targ_el.dataset.view = boss.view;
      let mesee = new_style;

    }//customize

    this.getHeight = function(dest)
    {
      let boss = this;

      //return `min-height:${boss._.tool.views[boss.view].height}px;`;
      let measure = (boss._.tool.views[boss.view][dest].measure != undefined && boss._.tool.views[boss.view][dest].measure != "") ?
      boss._.tool.views[boss.view][dest].measure : "";
      let height = (boss._.tool.views[boss.view][dest].height != undefined && boss._.tool.views[boss.view][dest].height != "" ) ?
      boss._.tool.views[boss.view][dest].height : "";
      return (measure != "" && height != "") ? `height:${boss._.tool.views[boss.view][dest].height}${measure};` : "";
    }//getHeight

    this.rivals = function(dest,active,adjust)
    {//deprecated - use link_vars
      let boss = this;

      switch (dest)
      {
        case 'root':
          if(boss._.tool.views[boss.view][dest][active] == true)
          {
            boss._.tool.views[boss.view][dest][adjust] = false;
          }
        break;
        default:
          if(boss._.tool.views[boss.view][dest][active] == true)
          {
            boss._.tool.views[boss.view][dest][adjust] = false;
          }
      }//switch
    }//rivals

    this.remove_select = function(dest,mod)
    {
      let boss = this;

      if(dest.match(/custom\d+/g) == false) return;
      if(mod == "view" && dest == "default") return;

      let targ_obj = (mod == "custom") ? boss._.tool.views[boss.view] :
       boss._.tool.views;
      let are_u_sure = confirm(`are you sure you want to delete ${targ_obj[dest].description}`)

      if(are_u_sure == true && targ_obj[dest])
      {

        targ_obj[dest].active_style = false;
        boss.prep_custom (dest);

        delete targ_obj[dest];
        boss.get_select_props(mod)
        .then(function(){



          let targ_sel_str = (mod == "custom") ? boss.custom_select: boss.view_select;
          let select_el = document.querySelector(`.${targ_sel_str}`);

          if(mod == "custom"){
            select_el.selectedIndex = 0;
            boss.destination = "";
          }else if(mod == "view"){
            var accessIndex = boss._.getSelectedValue(`.${targ_sel_str}`,"value_index","default");
            select_el.selectedIndex = accessIndex;
            boss.view = "default";
            boss._.view = boss.view;

            boss.soft_apply();
          }//if
        });//then
      }
    }//remove_select

    this.remove_view = function(vw,mod)
    {
      let boss = this;
      let mode = mod;
      switch (mode) {
        case 'reset':
          if(boss.exists(boss._.tool.views[boss.view]))
          {
            boss._.tool.views[boss.view] = boss._.bboy(boss._.tool.views.default)
          }
        break;
        default:
        //delete
          if(boss.exists(boss._.tool.views[boss.view]))
          {
            boss._.tool.views[boss.view] = {};
            let targ_sel_str = boss.view_select;
            let select_el = document.querySelector(`.${targ_sel_str}`);
            var accessIndex = boss._.getSelectedValue(`.${targ_sel_str}`,"value_index","default");
            //select_el.selectedIndex = accessIndex;
            //select_el.click();
            select_el.options[accessIndex].selected = true;

            boss.view = "default";
            boss._.view = boss.view;

            boss.soft_apply()
            .then(function(){
              try{
                //runs after the digest without error. - also when called before it doesn't trigger change event
                let event = new Event('change');
                select_el.dispatchEvent(event);
              }catch(err){
                console.log(err);
              }//catch
            });//.then
          }

      }//switch

      let mesee  = boss._.tool.views;
    }//remove_view


    this.getParam = function(data)
    {
      let boss = this;

      let  targ_data = data;
      let params_str = "params" + targ_data.id;

      if(boss.object_params[params_str] == undefined){
        boss.object_params[params_str] = JSON.parse(targ_data.params);
      }//end if

      let my_params = boss.object_params[params_str];
      //console.log("blog_module params =",my_params);

      return my_params;

    }//getParam

    this.get_adv_design = function (item,fE,tP) {
      // tP can be style or class
      let boss = this;
      let target_params = (item != undefined && boss._.exists(item)) ? JSON.parse(item) : "";

      if(target_params == "")return "";

      let focus_el = fE;
      let type = tP;
      let adv_design = "";

      let size_ary = {small:"mobile",medium:"tablet",large:"desktop",xlarge:"max"}
      let device_size = boss.get_device_size();

      if(boss._.exists(target_params.adv_design)){
        // removes returns and carriage returns
        target_params.adv_design = target_params.adv_design.replace(/[\n\r]/g,'');
        let adv_design_obj = JSON.parse(target_params.adv_design);
        adv_design = (boss._.exists(adv_design_obj[focus_el]) &&
        boss._.exists(adv_design_obj[focus_el][type])) ?
        adv_design_obj[focus_el][type] : "";
      }//if

        return adv_design;
    }//get_adv_design

    this.plusDivs = function(n) {
      let boss = this;
      if(boss.initiated == false)return;
      boss.showDivs(slideIndex += n);
    }// plusDivs

    this.showDivs = function(n) {
      let boss = this;
      var i;
      //let cls_str = "mySlides" + boss.iUN;
      //let cls_str = "mySlides";
      let cls_str = "mySlides" + boss._.module_id;//bugfix for multiple slideshows
      var x = document.getElementsByClassName(cls_str);

      if(x == undefined || x.length == 0)return;//bugfix for angular false positives

      if (n > x.length) {slideIndex = 1}
      if (n < 1) {slideIndex = x.length}
      for (i = 0; i < x.length; i++) {
         x[i].style.display = "none";
      }
      x[slideIndex-1].style.display = "block";
    }//end showDivs

    this.color_getter = function (cA) {
      let boss = this;
      let color_array = cA;
      let color_location = boss._.tool.views[boss.view];
      let all_colors = [];

      color_array.forEach(function(entry){
        let color_case = {};
        color_case.bg_color = color_location[entry].bg_color;
        color_case.bg_color = color_location[entry].bg_hov;
        color_case.bg_color = color_location[entry].bg_hov_color;
        color_case.border_color = color_location[entry].border_color;
        color_case.txt_color = color_location[entry].txt_color;
        color_case.txt_color = color_location[entry].font_color;
        color_case.txt_color = color_location[entry].font_hov_color;

        color_case_array = Object.keys(color_case);

        color_case_array.forEach(function(item){
          if(color_case[item] != undefined && color_case[item] != "" && color_case[item].charAt(0) == "#")
          {
            let is_in_array = boss._.valueChecker({"array":all_colors,"string":color_case[item],"mod":"index","type":"sna"});

            if(is_in_array[0] == -1)
            {
              //add the new swatch color to the array
              all_colors.push(color_case[item]);
            }//if
          }//if
        });//color_case_array.forEach

      });//color_array.forEach

      return all_colors;
    }//color_getter

    this.is_responsive = function(str)
    {
      let boss = this;
      //console.log("is_responsive str = ",str);
      switch(str)
      {
        case "yes":
          boss._.tool.views[boss.view].responsive = "1";
        break;
        case "no":
          boss._.tool.views[boss.view].responsive = "0";
        break;
      }//switch
    }//end is_responsive

    this.slick_fade = function (fStr)
    {
      let boss = this;
      let mode = fStr,
      ret_value;

      let is_active = (boss._.exists(boss._.tool.views[boss.view].fade_active)) ?
      boss._.tool.views[boss.view].fade_active : false;

      switch (mode) {
        case "active":
          //get status
          ret_value = is_active;
        break;
        case "speed":
          //get custom speed
          let fade_speed = ( is_active &&
            boss._.exists(boss._.tool.views[boss.view].fade_speed))
          ? boss._.tool.views[boss.view].fade_speed : 500;
          ret_value = fade_speed;
      }
      return ret_value;
    }// slick_fade

    this.test_link = function(dest,lObj,fc)
    {
      //test_link check to see if the item is linkable first
      let boss = this;
      let force = fc || false;
      let link = lObj.url || "";
      let anchor = lObj.anchor || "";
      let full_link = (link != "" && anchor != "") ? `${link}/#${anchor}` : link;
      let linkable = boss._.tool.views[boss.view][dest].linkable || false;
      if(force == false && linkable !== true || link == "")return;
      //window.location.replace(lnk);
      boss.link(full_link);
    }//test_link

    this.menu_test_link = function (tObj) {
      //test_link check to see if the item is linkable first
      let boss = this;
      let lObj = tObj.data;
      let dest = tObj.dest || "none";
      let force = tObj.force || false;
      let link_data = boss.getDisplayData(lObj,'url');
      let link = link_data || "";
      // let anchor = lObj.anchor || "";
      let anchor_data = boss.getDisplayData(lObj,'anchor');
      let anchor = anchor_data || "";
      let full_link = (link != "" && anchor != "") ? `${link}/#${anchor}` : link;
      let active = (lObj.active_link != undefined) ? lObj.active_link : true;
      let linkable = (dest == "none" || boss._.tool.views[boss.view][dest].linkable == undefined) ? true :
      boss._.tool.views[boss.view][dest].linkable;// legacy capatibility
      if(force == false && linkable !== true || force == false && active !== true  || link == "")return;
      //window.location.replace(lnk);
      boss.link(full_link);
    }// menu_test_link

    this.form_reset = function(fNm)
    {
      let boss = this;
      boss._.toolData.forEach(function(entry)
      {
        if(entry.file_name == fNm)
        {
          boss._.tool = boss._.bboy(entry);
        }
      });
    }//form_reset

    this.hnic = function()
    {
      let boss = this;
      return (boss._.tool.file_name == boss.file_name) ? true : false;
    }//hnic

    this.getAnchor = function(t_Obj,str)
    {
      let boss = this;
      let targ_obj = t_Obj;
      let active_anchor = targ_obj.active_anchor || false;
      let has_alias = (targ_obj.anchor_alias != undefined && targ_obj.anchor_alias != "") ? true : false;

      return (active_anchor && has_alias) ? targ_obj.anchor_alias : `${str}_${boss.iUN}`;
    }// getAnchor

    this.has_destination = function()
    {
      let boss = this;
      return (boss.destination == undefined || boss.destination == "") ? false : true;
    }//has_destination

    this.get_view = function()
    {
      let boss = this;
      // return "default";
      return boss.view;
    }//get_view


    this.get_select_props = function(mod)
    {
      let boss = this;
      //this preps a new array of a select menus dropdown options (custom_keys/view_keys)
      return new Promise(function(resolve, reject) {
        //if(boss._.tool.views[boss.view].custom == undefined){boss._.tool.views[boss.view].custom = {};}
        let targ_obj = (mod == "custom") ? boss._.tool.views[boss.view] :
        boss._.tool.views;
        let my_keys = Object.keys(targ_obj);
        if(mod == "custom")boss.custom_keys = {};
        if(mod == "view")boss.view_keys = {};

        if(my_keys.length > 0){
          my_keys.forEach(function(entry){

            let sample_array = (mod == "custom") ? boss.proper_properties: boss.proper_views;
            let is_in_array = boss._.valueChecker({"array":sample_array,"string":entry,"mod":"index","type":"sna"});

            if(is_in_array[0] != -1 || entry.match(/custom\d+/g))
            {
              ///custom[0-9]/g - works but only matches 1 digit
              //filter for approved/proper properties or 'custom' pfx
              if(mod == "custom"){
                boss.custom_keys[entry] = targ_obj[entry].description || entry;
              }else {
                boss.view_keys[entry] = targ_obj[entry].description || entry;
              }
            }//if
          });
        }
        boss[`${mod}_ary_obj`].options = (mod == "custom") ? boss.custom_keys : boss.view_keys ;
        resolve();
        //return boss.custom_ary_obj;
      });//promise
    }//get_select_props

    this.prep_view = function()
    {
      let boss = this;
      // Object.keys(obj).length === 0 && obj.constructor === Object
      if(boss.view != "default" && Object.keys(boss._.tool.views[boss.view]).length < 1)
      {
        // if its empty - clone default
        boss._.tool.views[boss.view] = lodash.merge(boss._.tool.views[boss.view],boss._.tool.views.default);////(dst,src)
      }//if

      boss.update_view()
      .then(function(){
        boss.soft_apply();
      });//.then
      let mesee = boss._.tool.views;
    }//prep_view

    this.make_select = function(str,mod)
    {
      let boss = this;
      let t_str = `.bM_${mod}_title_input`;
      let t_inp = document.querySelector(t_str);
      switch (str) {
        case "confirm":
          boss.loader = 1;

          let mod_t_c_t = boss[`temp_${mod}_text`] || "";
          mod_t_c_t = boss._.removeSomething(mod_t_c_t," ")
          if( mod_t_c_t  == ""){boss.make_select("cancel"); return;}
          let curr_keys = Object.keys(boss.custom_keys);

          //prevent duplicates
          let not_a_key = curr_keys.every(function(entry){
            return boss.custom_keys[entry] != mod_t_c_t;
          });

          if( not_a_key  == false){boss.make_select("cancel"); return;}

          //boss.destination = boss.temp_custom_text;
          //create a generic name
          let name_gen_str = "custom";
          //get length of tool details
          let details_length = (mod == "custom") ? (Object.keys(boss._.tool.views[boss.view])).length :
          (Object.keys(boss._.tool.views)).length;
          let current_select = "";
          for(let i = 1; i < details_length +1; i++)
          {
            //test for existing names
            let test_specimen = (mod == "custom") ? boss._.tool.views[boss.view] :
            boss._.tool.views;
            if(test_specimen[`${name_gen_str}${i}`] == undefined)
            {
              if(mod == "custom"){
                test_specimen[`${name_gen_str}${i}`] = {};
              }else {
                test_specimen[`${name_gen_str}${i}`] = boss._.bboy(boss._.tool.views.default);
              }
              test_specimen[`${name_gen_str}${i}`].description = mod_t_c_t;
              current_select = `${name_gen_str}${i}`;



              break;
            }//if
          }//for

          boss.get_select_props(mod)
          .then(function()
          {
            //then make it select a specific option
            boss[`temp_${mod}_text`] = "";
            boss[`add_${mod}`] = false;
            // let targ_sel_str = (mod == "custom") ? boss.custom_select: boss.view_select;
            // let select_el = document.querySelector(`.${targ_sel_str}`);
            // var accessIndex = boss._.getSelectedValue(`.${targ_sel_str}`,"value_index",current_select);
            //
            // //update the select menu's display and change the destination
            // //value to reflect the new data
            // select_el.selectedIndex = accessIndex;
            // boss.soft_apply({"callout":boss.remote_loader,"prop":"hide"})
            // .then(function(){
            //   boss.destination = current_select;
            // });
            boss.update_select_menu(current_select,mod);
          });

        break;
        case "cancel":
          boss[`temp_${mod}_text`] = "";
          boss[`add_${mod}`] = false;
          boss.loader = 0;
        break;
      }//switch
    }//make_select

    this.update_select_menu = function (cs,md)
    {
      let boss = this;
      let current_select = cs,
      mod = md || "default",
      targ_sel_str = (mod == "custom") ? boss.custom_select: boss.view_select,
      select_el = document.querySelector(`.${targ_sel_str}`),
      accessIndex = boss._.getSelectedValue(`.${targ_sel_str}`,"value_index",current_select);

      //update the select menu's display and change the destination
      //value to reflect the new data
      select_el.selectedIndex = accessIndex;
      boss.soft_apply(boss.remote_loader,"hide")
      .then(function(){
        // destination tells the advanced options which option to display
        // could be main or content or custom1
        if(mod == "custom"){
          //this is only really run when its made
          boss.destination = current_select;
        }//if
      });

    }// update_select_menu

    this.remote_loader = function(str)
    {
      let boss = this;
      switch (str) {
        case "show":
          boss.loader = 1;
          break;
        default:
          boss.loader = 0;
      }
    }//remote_loader

    this.is_custom = function()
    {
      let boss = this;
      return (boss.destination.match(/custom\d+/g)) ? true : false;
    }//is_custom

    this.not_custom = function()
    {
      let boss = this;
      let sample_array = boss.proper_properties;
      let is_in_array = boss._.valueChecker({"array":sample_array,"string":boss.destination,"mod":"index","type":"sna"});

      return (boss.destination == "" || is_in_array[0] == -1) ? true : false;
    }//not_custom

    this.declare_last = function(lst){
      let boss = this;
      let targ_str = boss.section_objects['body'];

      //call the parent target
      let collection = document.querySelectorAll(targ_str);
      let meseeks = "last here";

    }//declare_last

    this.setSelect = function(data,params)
    {

      let boss = this;
      if(data != undefined)
      {
        //console.log("here comes data",data);
        //params.targ[params.prop] = parseInt(data,10);//bugfix - used for font_size select menu - deprecated
        params.targ[params.prop] = data;
        //console.log("here comes more ",boss.tool.views[boss.view].title);
        //console.log("here comes more ",params.targ[params.prop]);
      }

      if(params.callout != undefined){
        params.callout();
      }//if

      return true;

    }//setSelect

    this.available_option = function(dest,prop)
    {
      return (dest[prop] != undefined) ? true : false;
    }//available_option

    this.unavailable_option = function(dest,prop)
    {
      return (dest[prop] == undefined) ? true : false;
    }//available_option

    this.make_tool_properties = function()
    {
      let boss = this;
      let custom_keys = [];
      let obj_keys = Object.keys(boss._.tool.views[boss.view]);
      let sample_array = boss.proper_properties;
      boss.tool_properties = [];

      obj_keys.forEach(function(entry)
      {
          ///custom[0-9]/g - works but only matches 1 digit
          //filter for approved/proper properties or 'custom' pfx
          let is_in_array = boss._.valueChecker({"array":sample_array,"string":entry,"mod":"index","type":"sna"});

          if(is_in_array[0] != -1 /* || entry.match(/custom\d+/g)*/)
          {
            //i don't want any custom properties in here
            custom_keys.push(entry);
          }
      });

      boss.tool_properties = custom_keys;

      let mesee = custom_keys;
      boss.soft_apply();

    }//make_tool_properties



  }]);//end service "boss._"

  // var other_common_variabes = true;

})();//end closure
