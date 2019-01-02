(function(){
  //console.log("mega_menu.js running!");
  var app = angular.module("pictureShow");
  app.directive("imageMenu",["$window",function($window){
  return{
    restrict:"C",
    templateUrl:function(elem, attr){
      let file_name = attr.marquee;
      if(file_name != "image_menu")return;
      let template_style = (attr.motiv == "settings") ? "admin" : attr.motiv;
      //let urlStr = `${BASEURL}components/com_psmod/xfiles/js/${file_name}.html`;

      let urlStr = `${attr.home}tool_templates/${file_name}/templates/${template_style}.html`;

      //console.log(`new url string = ${urlStr}`);

      return urlStr;
    },
    scope: {
      marquee: '@',
      cast: '@',
      home: '@',
      motiv: '@',
      sttngs: '=',
      mode: '@',
      stage: '@'
    },/* to pass in a string you have to do '@' and to pass in an object you have to do '=' */
    link: function(scope, element, attrs){

      if(attrs.mode == "admin")
      {
        ///the section updates the available screen_width and height on resize - useful for admin settings
        angular.element($window).bind('resize', function(){
          //bugfix - the element passed here doesn't always have a controller but the scope seems constant
          let my_scope = scope;
          //let el_ctrlr = element.controller();//bug: doesn't always have a controller
          let el_ctrlr = scope.take1;//fixed
          el_ctrlr._.screen_width = document.body.clientWidth;
          //el_ctrlr._.screen_width = document.querySelector(el_ctrlr.front_stage).parentNode.clientWidth;
          //console.log("clientWidth = ",document.body.clientWidth);
          el_ctrlr._.screen_height = document.body.clientHeight;
          //el_ctrlr._.screen_height = document.querySelector(el_ctrlr.front_stage).parentNode.clientHeight;
          //console.log("clientHeight = ",document.body.clientHeight);
          el_ctrlr.refresh();
        });

      }else {
        angular.element($window).bind('resize', function(){
          let my_scope = scope;
          //let el_ctrlr = element.controller();//bug: doesn't always have a controller
          let el_ctrlr = scope.take1;//fixed
          el_ctrlr._.resize_id ++;
          //el_ctrlr.slick_refresh();
          // el_ctrlr._.refresh_tool = "true";
          var phase = scope.$root.$$phase;
          if(phase == '$apply' || phase == '$digest') {
              el_ctrlr.update_view();
          } else {
            scope.$apply(el_ctrlr.update_view());
          }//else

          el_ctrlr.soft_apply()
          .then(function(){
            //fixes the slick slider refresh delay - formerly passed as a callout to soft_apply
            //el_ctrlr.slick_refresh();
          });
        });
      }

      /*if(element[0].className.indexOf("mM_mov") == -1)return;
      element.on("dragstart",function(event){ctrl.dragstart_handler(event);});

      element.on("dragover",function(event){ctrl.allowDrop(event);});

      element.on("drop",function(event){ctrl.drop_handler(event);});

      element.on("dragenter",function(event){ctrl.dummy(event,"in");});

      element.on("dragend",function(event){ctrl.stop_the_press(event);});*/

    },
    controller:["ShowData","$sce","$scope","$timeout",function(ShowData,$sce,$scope,$timeout){

      /** VARSECT - variable section **/
      var boss = this;
      this.service = ShowData;
      this._ = ShowData;
      if(boss._.tool.file_name != "image_menu")return;

      var iUN = Math.round(Math.random() * 10000);
      this.iUN = iUN;

      this.file_name = boss.marquee;
      this.object_params = [];
      this.object_elements = {};
      this.categoryForm;
      this.menuForm;

      if(boss._.tool.params.mega_menu == undefined)boss._.tool.params.mega_menu = {};
      if(boss._.tool.params.mega_menu.category == undefined)boss._.tool.params.mega_menu.category = [];
      this.category_array = this._.tool.params.mega_menu.category;

      //boss.my_stars;//set during injector phase
      this.initiated = false;//helps to delay calling elements b4 template is ready
      this.screen_width = ShowData.screen_width;
      this.screen_height = ShowData.screen_height;
      this.responsive = 1;
      this.background = "";
      this.view = "default";
      this.add_view = false;
      this.view_select = `imageMenu_view_select_${boss.iUN}`;
      this.section = "items";
      this.option_section = "options";
      this.front_stage = "";
      var slideIndex = 1;
      this.font_slide_nbr = "";
      this.destination = "";
      this.add_custom = false;
      this._.resize_id = 0;
      this.custom_select = `imageMenu_custom_select_${boss.iUN}`;

      this.info_space = {
        height_style:0,
		    limit_devices:0,
        design_mode:0,
        custom_element:0
      }

      this.proper_properties = [
        "nav","logo",
        "logo2","button",
        "outer","main",
        "content","image",
        "title","body",
        "list","list2",
        "wrapper","panel"
      ];

      this.create_category = 0;
      this.edit_menu = 0;
      this.edit_submenu = 0;
      this.create_custom = 0;
      this.item_title = "";
      this.restore_title = "";
      this.item_id = "";
      this.item_src = "";
      this.item_url = "";
      this.restore_url = "";
      this.item_category = "";
      this.insert_mode = "default";
      this.valid_title = "default";
      this.valid_url = "default";
      this.custom_select = `imageMenu_custom_select_${boss.iUN}`;
      this.loader = 0;
      this.loader_el = "imageMenu_curtain";
      this.strict_titles = true;

      this.menu_display = "category";
      this.last_section = "none";
      this.menu_category_id = "none";
      //this.xmenu_category_obj = "";
      this.menu_category_ndx = "";
      this.submenu_menu_id = "none";
      this.submenu_menu_obj = "";
      this.submenu_menu_ndx = "";
      this.view_menu = 0;
      this.select_type = "all";//four btns for type of data ie asset,page,search,all
      this.select_access = "selected";//access quantity
      this.select_array = [];//temp array for staging menu assets
      this.tricky_obj = {"menu":"category","submenu":"menu"};
      this.multi_select = 0;
      this.hold_selection = [];
      this.device_size = "";

      this.bigData = [];

      //console.log("stars = ",this.stars);



      $scope.$watch(function(){return boss.marquee}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
          if(boss._.tool.file_name != "image_menu")return;
        boss.file_name = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss.view}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
          if(boss._.tool.file_name != "image_menu")return;
          boss._.current_view = newValue;
          boss.make_tool_properties();
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.view}, function (newValue, oldValue, scope) {
        if (newValue)

        if(boss._.tool.file_name != "image_menu")return;

        boss.view = newValue;
        boss._.view = boss.view;
        ShowData.refresh_tool = "true";

        boss.soft_apply();

      }, true);

      //watch for changes in assets
      $scope.$watch(function(){return boss._.asset_info}, function (newValue, oldValue, scope) {
        //Do anything with $scope.letters
        //console.log("newValue = ",newValue);
        //console.log("oldValue = ",oldValue);
        if (newValue && boss.initiated == true)
          if(boss._.tool.file_name != "image_menu")return;
          //boss.my_stars = newValue;
        boss.my_stars = newValue;//i think this is an array of all the asset content associated with this tool
        //console.log("i see a change in my_stars = ",boss.my_stars);

      }, true);

      $scope.$watch(function(){return boss._.screen_width}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        boss.screen_width = newValue;
        if(boss.initiated == true)
        {
          if(boss._.tool.file_name != "image_menu")return;
          boss.process_size();
        }//end if
        //console.log("i see a change in screen_width = ",boss.screen_width);
      }, true);
      $scope.$watch(function(){return boss._.screen_height}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        boss.screen_height = newValue;
        if(boss.initiated == true)
        {
          if(boss._.tool.file_name != "image_menu")return;
          boss.process_size();
        }//end if
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.preview_display}, function (newValue, oldValue, scope) {
        if (newValue){

          if(boss.initiated == true)
          {
            if(boss._.tool.file_name != "image_menu")return;
            boss.process_size();
          }//end if
        }
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.menu_category_obj }, function (newValue, oldValue, scope) {
        if (newValue){

          if(boss.initiated == true)
          {
            if(boss._.tool.file_name != "image_menu")return;
            boss.prep_elements();
          }//end if
        }
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.submenu_menu_obj}, function (newValue, oldValue, scope) {
        if (newValue){

          if(boss.initiated == true)
          {
            if(boss._.tool.file_name != "image_menu")return;
            boss.prep_elements();
          }//end if
        }
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);


      $scope.$watch(function(){return boss._.tool.views[boss.view].custom_class}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
          if(boss._.tool.file_name != "image_menu")return;
        boss.cast = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.tool.views[boss.view].width_pct}, function (newValue, oldValue, scope) {
        if(boss._.tool.file_name != "image_menu")return;
        if (newValue)
          //boss.my_stars = newValue;
        //boss.cast = newValue;
        boss.process_size();
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.tool.views[boss.view].auto_width}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        //boss.cast = newValue;
        if(boss._.tool.file_name != "image_menu")return;
        boss.process_size();
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      //do i need this $watch?
      $scope.$watch(function(){return boss._.tool.views[boss.view].sample_class}, function (newValue, oldValue, scope) {
        if (newValue){
          if(boss._.tool.file_name != "image_menu")return;
          //boss.my_stars = newValue;
        //boss.alternate = newValue;
        }
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.tool.params}, function (newValue, oldValue, scope) {
        if (newValue){
          if(boss._.tool.file_name != "image_menu")return;
          //boss.my_stars = newValue;
        //boss.alternate = newValue;
        $timeout(function(){

          boss.prep_elements();
        },0,true);
        }
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      //watch for ShowData.tool changes
      $scope.$watch(function(){return boss._.tool}, function (newValue, oldValue, scope) {
        if (newValue)
        if(boss._.tool.file_name != "image_menu")return;
          //boss.my_stars = newValue;
        boss.tool = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
          boss.process_size();

      }, true);

      $scope.$watch(function(){return boss._.tool.views[boss.view]}, function (newValue, oldValue, scope) {
        if (newValue){
          if(boss._.tool.file_name != "image_menu")return;
          let mesee = newValue;
          //boss.my_stars = newValue;
        //boss.alternate = newValue;
        }
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.tool.menu_ids}, function (newValue, oldValue, scope) {
        if (newValue)
        if(boss._.tool.file_name != "image_menu")return;
        boss.prepData();
        boss.prep_elements();
      }, true);


      //console.log("select array = ",this.selectArray)
      this.$onInit = function() {
        //boss.my_stars = boss.stars;
        //console.log(this);

        let mt = boss._.tool.module_title;
        console.log("module title = ",mt);

        boss.update_view()
        .catch(function(err){
          //console.log('not on my watch')
        });;

        boss.prepData();

        boss._.screen_width = document.body.clientWidth;
        boss._.screen_height = document.body.clientHeight;
        //let venue = document.querySelector(boss.front_stage).parentNode;
        //boss._.screen_width = venue.clientWidth;
        //boss._.screen_height = venue.clientHeight;//probably won't have dimensions till i fill it?

        if(Object.keys(ShowData.tool).length !== 0 && ShowData.tool.constructor === Object)
        {
          //if the object isn't empty do this
          //console.log("tool width is ",ShowData.tool.views[boss.view].width);
          if(ShowData.tool.views[boss.view].width == "default"){
            ShowData.tool.views[boss.view].width = document.body.clientWidth * .80;
            //ShowData.tool.views[boss.view].width = document.querySelector(boss.front_stage).parentNode.clientWidth * .95;
          }


          let banner_ratio = 8/3;
          if(ShowData.tool.views[boss.view].height == "default"){
            ShowData.tool.views[boss.view].height = Math.ceil(ShowData.tool.views[boss.view].width / banner_ratio);
          }
        }
        $timeout(function(){
           //console.log("post Digest with $timeout");
           boss.initiated = true;
           //boss.my_stars = boss.update_assets(ShowData.asset_ids);
           boss.my_stars = ShowData.asset_info;//from
           //boss.prep_elements();
           //if(boss.my_stars.length == 0){  boss.outer_style();}
        },0,true).then(function(){
           //boss.showDivs(slideIndex);
           //late watch
           slideIndex = 1;
           $scope.$watch(function(){return boss._.tool.views[boss.view].width}, function (newValue, oldValue, scope) {
             if (newValue)
               //boss.my_stars = newValue;
               if(boss._.tool.file_name != "image_menu")return;
               if(newValue == "default"){
                 ShowData.tool.views[boss.view].width = document.body.clientWidth * .95;
                 //ShowData.tool.views[boss.view].width = document.querySelector(boss.front_stage).parentNode.clientWidth * .95;
                 //if(boss.my_stars.length == 0 && boss.initiated == true){boss.outer_style();}
               }
             //console.log("i see a change in screen_height = ",boss.screen_height);
           }, true);

           $scope.$watch(function(){return boss._.tool.views[boss.view].height}, function (newValue, oldValue, scope) {
             if (newValue)
               //boss.my_stars = newValue;
               if(boss._.tool.file_name != "image_menu")return;
               if(newValue == "default"){
                 let c_Ht = document.body.clientWidth * .95;
                 //let c_Ht = document.querySelector(boss.front_stage).parentNode.clientWidth * .95;
                 //why 2.666? i guess im going to automatically make the default a banner style
                 ShowData.tool.views[boss.view].height = Math.ceil(c_Ht/2.66666);
               }
             //console.log("i see a change in screen_height = ",boss.screen_height);
           }, true);

           $scope.$watch(function(){return boss._.tool.views[boss.view].responsive}, function (newValue, oldValue, scope) {
             if (newValue)
             if(boss._.tool.file_name != "image_menu")return;
               //boss.my_stars = newValue;
             boss.responsive = newValue;
             //console.log("i see a change in responsive = ",boss.responsive);
             $timeout(function(){
               //console.log("responsive timeout running!");
               if(boss.initiated == true)
               {
                 boss.process_size();
               }//end if
             },0,true);
           }, true);

           //window.dispatchEvent(new Event('resize'));
        });//end .then() of $timeout

        //return;

      };//$oninit

      /***************  ITEM SECTION  *****************/

      this.prepData = function()
      {
          return new Promise(function(resolve, reject) {

            if(boss.mode == "site" && boss.motiv != "settings"){
              //get full details of the id data from the db and place in needed objects
              boss._.getMenus(boss._.tool.menu_ids).then(function(results){

                //make a compiled list of all the category asset_ids and page_ids
                boss._.tool_asset_ids = boss._.compile_id_list(boss._.tool.menu_ids,"asset");
                boss._.tool_page_ids = boss._.compile_id_list(boss._.tool.menu_ids,"page");
                return;
              }).then(function(result){

                return boss._.getAssets(boss._.tool_asset_ids);
              }).then(function(result){

                return boss._.getPages(boss._.tool_page_ids);
              }).then(function(result){
                resolve();
              });

            }else{

              //make a compiled list of all the category asset_ids and page_ids
              boss._.tool_asset_ids = boss._.compile_id_list(boss._.tool.menu_ids,"asset");
              boss._.tool_page_ids = boss._.compile_id_list(boss._.tool.menu_ids,"page");


              //get info and details
              //menu_info is redundant but i need to run it if the menu id changes.
              boss._.menu_info = boss._.update_menu_info(boss._.menu_ids); //i can run it in the watch
              boss._.menu_details = boss._.update_menu_info(boss._.menu_ids,"details");//but i want it all in the same place

              boss._.tool_asset_info = boss._.update_asset_info(boss._.tool_asset_ids);
              boss._.tool_asset_details = boss._.update_asset_info(boss._.tool_asset_ids,"details");

              boss._.tool_page_info = boss._.update_page_info(boss._.tool_page_ids);
              boss._.tool_page_details = boss._.update_page_info(boss._.tool_page_ids,"details");
              resolve();
            }//else

          //return;
        });//Promise

      }//prepData

      this.check_enter = function(str)
      {

        var _key = event.which || event.keyCode;
        if (event.which == 13 || event.keyCode == 13)
        {
          boss.createItem(str)
        }//if
      }//check_enter

      this.createItem = function(mod)
      {
        boss.loader = 1;
        let type = (boss.create_custom == 1) ? boss.last_section : boss.menu_display;
        let targ_ary = boss.getCurrentArray(type);
        let targ_item;

        let targ_category = mod || boss.item_category;

        let text_validity = boss.check_entry(boss.item_title,'title');
        let list_validity = (mod != "category") ? boss.check_entry(boss.item_url,'url') : true;
        //if is invalid do nothing
        if(text_validity == "invalid" || list_validity == "invalid")
        {
          boss.loader = 0;
          return;
        }
        if(boss.insert_mode != "edit"){
          let now = new Date();
          let new_id = now.getTime();
          let src_str = (mod == "custom") ? mod : "category";
          //switch here for custom and category

          let new_obj = {};
          new_obj.id = new_id;
          new_obj.src = mod;

          let obj_type = (mod == "custom") ? boss.last_section : mod;
          switch (obj_type) {
            case "category":
              new_obj.title = boss.item_title;
              new_obj.menu = [];
            break;
            case "menu":
              //menu only values
              new_obj.submenu = [];
            case "submenu":
              //values written here are for menu and submenu
              new_obj.custom_title = boss.item_title;
              new_obj.custom_url = boss.item_url;
            break;

          }//switch

          targ_ary.push(new_obj);

        }else {
          targ_item = boss.getItemData(targ_ary,boss.item_id,boss.item_src);
          switch (targ_category) {
            case "category":
              targ_item.title = boss.item_title;
            break;
            default:
            //for menus and submenus if there is a change save it as custom_x which has precedence
            //if its thae same remove custom_x giving the db value precedence
              if(targ_item.title !== boss.item_title){
                targ_item.custom_title = boss.item_title;
              }else{
                if(targ_item.custom_title)
                delete targ_item.custom_title;
              }

              if(targ_item.url !== boss.item_url){
                targ_item.custom_url = boss.item_url;
              }else{
                if(targ_item.custom_url)
                delete targ_item.custom_url;
              }
          }
        }//else

        boss.create_category = 0;
        boss.create_custom = 0;

        boss.reset_item_creator();
        if(mod == "custom"){boss.cancel_select()}
        boss.soft_apply();
      }//createItem

      this.check_entry = function(tStr,mod){
        let inValue = tStr;
        //make sure we have an array to check
        let display_var = (boss.menu_display == "select") ? "custom" : boss.menu_display;

        let xt = (mod != undefined && mod == "url") ? "Url" : "Txt";
          let form_valid = boss[`${display_var}Form`][`${display_var}${xt}`].$valid;
        //clean it up
        //title_input.value = ShowData.removeSomething(title_input.value," ")
        inValue = ShowData.removeSomething(inValue," ");

        //if im using strict titles check for uniqueness
        let im_unique = (boss.strict_titles == true && mod == "title") ? boss.unique(boss._.tool.params.mega_menu.category,boss.item_title) : true;

        if(inValue == undefined || inValue == "" || im_unique != true || form_valid != true)
        {
          boss[`valid_${mod}`] = "invalid";
          return "invalid";
        }else {
          boss[`valid_${mod}`] = "valid";
          return "valid";
        }//else

      }//check_entry

      this.prep_value = function(atr,item)
      {
        switch(atr){
          case "url":
            return (item.custom_url != undefined && item.custom_url != "") ? item.custom_url : item.url;
          break;

          default:
          //title
          return (item.custom_title != undefined && item.custom_title != "") ? item.custom_title : item.title;
          break;
        }//switch
      }

      this.edit_item = function(type,elem)
      {
        event.preventDefault();
        boss.insert_mode = "edit";
        boss.item_id = elem.id;
        boss.item_title = (elem.custom_title != undefined && elem.custom_title != "") ? elem.custom_title : elem.title;
        boss.restore_title = elem.title;
        if(type != "category")
        {
          boss.item_url = (elem.custom_url != undefined && elem.custom_url != "") ? elem.custom_url : elem.url;
          boss.restore_url = elem.url;
        }
        boss.item_src = elem.src;
        boss.item_category = type;
        switch (type) {
          case "category":
            boss.create_category = 1;
          break;
          case "menu":

            boss.edit_menu = 1;
          break;
          case "submenu":
            boss.edit_submenu = 1;
          break;
        }//switch

        event.stopPropagation();
      }//edit_item

      this.restore_inputs = function()
      {
        event.preventDefault();
        if(boss.item_src == "custom")return;
        boss.item_title = boss.restore_title;
        boss.item_url = boss.restore_url;
      }

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

      this.exists = function(item)
      {
        return (item != undefined && item != "") ? true : false;
      }//exists

      boss.reset_item_creator = function(form)
      {
        boss.item_title = "";
        boss.item_url = "";
        this.item_id = "";
        //modification for selectForm (whichalso uses custom as an alias)
        let display_var = (boss.menu_display == "select") ? "custom" : boss.menu_display;

        boss[`${display_var}Form`][`${display_var}Txt`].$setPristine();
        boss[`${display_var}Form`][`${display_var}Txt`].$setUntouched();

        if(boss[`${display_var}Form`][`${display_var}Url`]){
          boss[`${display_var}Form`][`${display_var}Url`].$setPristine();
          boss[`${display_var}Form`][`${display_var}Url`].$setUntouched();
        }

        boss.valid_title = "default";
        boss.valid_url = "default";
        this.insert_mode = "default";

        boss.create_category = 0;
        boss.edit_menu = 0;

      }//reset_item_creator

      this.delete_item_og = function(type,elem,mod)
      {
        event.preventDefault();
        let mode = mod || "default";
        let rem_str = ".rbx" + elem.id;
        let hr_str = ".r_hr" + elem.id;
        let remove_box = document.querySelector(rem_str);
        let remove_hr = document.querySelector(hr_str);
        let targ_ary = boss.getCurrentArray(type);

        switch (mode) {
          case "confirm":
              boss.reset_remove_boxes();
          break;
          case "cancel":
              boss.reset_remove_boxes();
          break;
          default:
          let content_nbr = (elem.menu == undefined || elem.menu.length < 1) ? 0 : elem.menu.length;

            //if it has contents do this
            if(content_nbr < 1){
              boss.getItemData(targ_ary,elem.id,elem.src,"delete");
              boss.reset_remove_boxes();
            }else{
              remove_box.style.display = "flex";
              remove_hr.style.display = "block";
            }//else
        }

        event.stopPropagation();

      }//delete_item_og

      this.start_menu_editor = function(oDat)
      {
        event.preventDefault();
        $scope.$emit("broadcast start menu editor",oDat);
        event.stopPropagation();
      }

      this.delete_item = function(type,elem,mod)
      {
        event.preventDefault();
        let targ_ary = boss._.menu_ids;

        targ_ary.forEach(function(item,ndx,iDAry){

          if(item == elem.id){
            iDAry.splice(ndx,1);
          }
        });

        event.stopPropagation();
      }//delete_item


      this.getCurrentArray = function(type,alt){
        /*
          hack - i added a modifier that gives me the arrays parent so i can
          rewrite the array without changing the variables reference value
          sample: let targ_ary = boss.getCurrentArray(type,"parent");
          targ_ary[type] = boss.item_order;
        */
        let targ_ary,
        alternate = alt || "default",
        targ_cat_ary,
        targ_menu_ndx,
        targ_menu_ary,
        targ_submenu_ndx,
        targ_submenu_ary;

        switch (type) {
          case 'category':
           targ_cat_ary = (alternate == "parent") ? boss._.tool.params.mega_menu :
           boss._.tool.params.mega_menu.category;
           targ_ary = targ_cat_ary;
          break;
          case 'menu':
            /*targ_menu_ndx = boss.getItemData(boss._.tool.params.mega_menu.category,
                            boss.menu_category_id,boss.menu_category_src,"index");

            targ_menu_ary = (alternate == "parent") ? boss._.tool.params.mega_menu.category[targ_menu_ndx] :
            boss._.tool.params.mega_menu.category[targ_menu_ndx].menu;*/
            targ_menu_ary = (alternate == "parent") ? boss._.menu_category_obj  : boss._.menu_category_obj.menu;

            if(boss._.menu_category_obj  == "")
            {
              let stop_the_press = true;
            }
            targ_ary = targ_menu_ary;
          break;
          case 'submenu':
            /*targ_menu_ndx = boss.getItemData(boss._.tool.params.mega_menu.category,
                            boss.menu_category_id,boss.menu_category_src,"index");

            targ_menu_ary = boss._.tool.params.mega_menu.category[targ_menu_ndx].menu;
            targ_menu_ary = boss._.menu_category_obj.menu;
            targ_submenu_ndx = boss.getItemData(targ_menu_ary,boss.submenu_menu_id,
                                boss.submenu_menu_src,"index");
            targ_submenu_ary = (alternate == "parent") ?  targ_menu_ary[targ_submenu_ndx] :
             targ_menu_ary[targ_submenu_ndx].submenu;*/
             targ_submenu_ary = (alternate == "parent") ?   boss._.submenu_menu_obj : boss._.submenu_menu_obj.submenu;
            targ_ary = targ_submenu_ary;
          break;
        }//switch

        return targ_ary;
      }//getCurrentArray

      this.getItemData = function(iArray,dId,src,mod)
      {
        //boss.menu_category_id etc. originally set by viewMenu
        let targ_id = dId;
        let targ_data = "none";
        let targ_src = src;
        let mode = mod || "default";
        //
        if(iArray == undefined){
          let stop_the_press = true;
        }
        iArray.forEach(function(item,ndx,iDAry){
          if(item.id == undefined)return;

          if(item.id == targ_id && targ_src == item.src){
            if(mode == "delete"){
              iDAry.splice(ndx,1);
            }else if(mode == "index"){
              targ_data = ndx;
            }else{
              targ_data = item
            }
          }
        });
        return targ_data;
      }///getItemData

      this.reset_remove_boxes = function(){
        //reset remove confirmation display
        let rm_boxes = document.querySelectorAll(".mM_item_lower");
        let rm_hrs = document.querySelectorAll(".r_hr");
        rm_boxes.forEach((entry)=>{
          entry.style.display = "none";
        });
        rm_hrs.forEach((entry)=>{
          entry.style.display = "none";
        });
      }//reset_all

      this.getParentText = function(type)
      {
        let type_mod = boss.tricky_obj[type];
        //wherever i am it will get the parent of
        let targ_id = ( type_mod == "category") ? boss.menu_category_id : boss.submenu_menu_id;
        let targ_src = ( type_mod == "category") ? boss.menu_category_src : boss.submenu_menu_src;
        let targ_ary = boss.getCurrentArray(type_mod);
        let targ_obj = boss.getItemData(targ_ary,targ_id,targ_src);
        return targ_obj.title;
      }//getParentText

      this.getParentType = function(type)
      {
        //returns parent type string
        return boss.tricky_obj[type];
      }//getParentType

      this.data_converter = function(array,type)
      {
        let test_array = [];
        test_array = test_array.concat(array);//needed to break array data from original
        let temp_array = [];
        if(array.length < 1) return false;
         test_array.forEach(function(entry){
           let temp_obj = {};
           entry = boss._.bboy(entry);
           switch(type)
           {
             case "asset":
              let temp_params = (typeof entry.params == "string") ? JSON.parse(entry.params) : entry.params;
               temp_obj.id = entry.id;
               temp_obj.title = (temp_params.text.head.text == "") ? temp_params.title : temp_params.text.head.text;
               temp_obj.url = (temp_params.text.list.url == "") ? "none" : temp_params.text.list.url;
               if(temp_obj.url == "none")return;
               temp_obj.src = "asset";

               if(boss.last_section == "menu"){temp_obj.submenu = [];}
               temp_array.push(temp_obj);
             break;

             case "page":
              temp_obj.id = entry.id;
              temp_obj.url = entry.alias;
              temp_obj.url2 = entry.list;
              temp_obj.title = entry.title;
              temp_obj.published = entry.published;//evaluated at runtime to show or not show menu item
              temp_obj.src = "page";
              if(boss.last_section == "menu"){temp_obj.submenu = [];}
              temp_array.push(temp_obj);
             break;
           }//switch
         });
         return temp_array;
      }//data_converter


      this.select_resource = function(type)
      {
        boss.menu_display = "select";
        boss.last_section = type;

        boss.getResources('page');
      }//select_resource

      this.getResources = function(type)
      {
        let my_params_array = [];
        my_params_array = my_params_array.concat(boss._.assetData);
        my_params_array = boss.prep_asset_params(my_params_array);

        let temp_pages,
        temp_assets;

        //console.log("page ids",boss._.data.page_ids);
        //console.log("asset ids",boss._.asset_ids);
        //console.log("page reference",boss._.page_reference);
        //console.log("asset reference",my_params_array);

        //boss.service
        boss.bigData = [];
        boss.select_type = (type == "asset") ? "media" : type;
        switch (type) {
          case "all":
            //take page and assets and combine them into one array
            //convert data to mega menu json format
            temp_pages = boss.data_converter(boss._.pageData,"page");
            temp_assets = boss.data_converter(boss._.assetData,"asset");
            boss.bigData = boss.bigData.concat(temp_pages);
            boss.bigData = boss.bigData.concat(temp_assets);
          break;

          case "page":
            temp_pages = boss.data_converter(boss._.pageData,"page");
            boss.bigData = boss.bigData.concat(temp_pages);
          break;
          case "asset":
            temp_assets = boss.data_converter(boss._.assetData,"asset");
            boss.bigData = boss.bigData.concat(temp_assets);
          break;
          case "search":
            //
          break;
          case "custom":
            //
            boss.create_custom = 1;
          break;

        }

      }//getResources

      this.getSelectIcon = function(type)
      {
        return (type == "page") ? "insert_drive_file" : "camera_enhance";
      }//getSelectIcon

      this.prep_asset_params = function(data){
        let t_array = []
        data.forEach(function(entry){
          entry = boss._.bboy(entry);
          entry.params = JSON.parse(entry.params);
          t_array.push(entry);
        });
        return t_array;
      }//prep_asset_params

      this.cancel_select = function()
      {
        boss.menu_display = `${boss.last_section}`;
        //clear the hold array
        boss.hold_selection = [];
        boss.multi_select = 0;
      }//cancel_select

      this.reset_section = function(mode)
      {
        //controls the back btn to get back to a previoius menu display
        switch (mode) {
          case 'menu':
            boss.menu_category_id = "none";
            boss.menu_display = 'category';
            boss.reset_remove_boxes();
          break;
          case 'submenu':
            boss.submenu_menu_id = "none";
            boss.menu_display = 'menu';
          break;
        }
        $timeout(function(){
           //console.log("appjs Digest with $timeout");
           boss.prep_elements();
         },0,true)
      }//reset_section


      this.is_selected = function(obj)
      {
        return boss.select_one(obj,"test");

      }//is_selected


      this.select_one = function(obj,alt)
      {
        //check for duplicates
        if(event){event.preventDefault();}
        let type = boss.last_section;
        let targ_ary = boss.getCurrentArray(type);
        let obj_id = obj.id;
        let obj_src = obj.src;
        let alternative = alt || "default";
        let has_hold;
          //check for menu array
          //if(targ_ary[type] == undefined) targ_ary[type] = [];
          let has_duplicate = boss.getItemData(targ_ary,obj_id,obj_src);

          switch (alternative) {
            case "test":
              return (has_duplicate == "none") ? false : true;
            break;
            case "held":
            has_hold = (boss.hold_selection.length > 0) ? boss.getItemData(boss.hold_selection,obj_id,obj_src) : "none";
            return (has_hold == "none") ? false : true;
            break;
            case "hold":
              has_hold = (boss.hold_selection.length > 0) ? boss.getItemData(boss.hold_selection,obj_id,obj_src) : "none";
              if(has_duplicate != "none") return;//if its already a menu don't bother

              //let targ_el = boss.true_target(event.target,'selector');
              //see if its in hold array
              if(has_hold == "none"){
                //if it isn't add it to the array
                boss.hold_selection.push(obj);
                boss.multi_select = 1;

                //targ_el.className = ShowData.removeSomething(targ_el.className,"hold","");
                //add active color
                //targ_el.className += " hold";
                return;
              }else {
                boss.getItemData(boss.hold_selection,obj_id,obj_src,"delete");
                //targ_el.className = ShowData.removeSomething(targ_el.className,"hold","");

                if(boss.hold_selection.length < 1){
                  boss.multi_select = 0;
                }
                return;
              }//else
            break;
          }//switch


          if(has_duplicate == "none")
          {
            //targ_ary[type].push(obj);
            targ_ary.push(obj);
            //targ_ary.menu;
          }//end if

          boss.cancel_select();
          event.stopPropagation();
        //add to temp array
        //boss.select_array = obj;
        //process array
      }//select_one

      this.select_many = function(obj)
      {
        //toggle to temp array
        let type = boss.last_section;
        if(boss.hold_selection.length > 0)
        {
          let targ_ary = boss.getCurrentArray(type,"parent");
          //targ_ary = targ_ary.concat(boss.hold_selection);
          //console.log(targ_ary);
          /*boss.hold_selection.forEach(function(entry){
            targ_ary.push(entry);
          });*/
          targ_ary[type] = targ_ary[type].concat(boss.hold_selection);
        }//if

        boss.cancel_select();

      }//select_many


      this.setup = function()
      {
        if(boss._.tool.params.mega_menu == undefined)boss._.tool.params.mega_menu = {};
        if(boss._.tool.params.mega_menu.category == undefined)boss._.tool.params.mega_menu.category = [];

        boss.set_params();
      }

      this.set_params = function()
      {
        //set up the obj params system so i have something to draw data from
        let db_obj = boss.my_stars;

        if(db_obj == undefined || typeof db_obj != "object" || db_obj.length < 1)return;

        db_obj.forEach(function(entry){

          var inObj = entry;

          let obj_params = JSON.parse(inObj.params);

          let params_str = "params" + inObj.id;
          // i didn't want to do numbers and create gap indexes so i used a multidim array
          boss.object_params[params_str] = obj_params;
        });
      }//set_params

      this.check_integrity = function()
      {
        //check menu/submenu check integrity of the data
        let menu_data = boss._.tool.params.mega_menu.category;
        menu_data.forEach(function(category){
          //check to see if menu items are present
          let is_present = false;
          if(category.menu == undefined || category.menu.length == 0) return;

          category.menu.forEach(function(menu_item,ndx,ary){
            if(menu_item.subs != undefined && menu_item.subs.length != 0){
              //check submenu first
              menu_item.subs.forEach(function(sm_item,s_ndx,s_ary){
                let sub_is_present = false;
                sub_is_present = boss.my_stars.some(function(s_item){
                  return s_item.id == sm_item.id;
                });
                //if its not there remove it
                if(sub_is_present == false){
                  s_ary.splice(s_ndx,1);
                }
              });

              let menu_is_present = false;
              menu_is_present = boss.my_stars.some(function(m_item){
                return m_item.id == menu_item.id;
              });
              //if its not there remove it
              if(menu_is_present == false && menu_item.subs.length == 0){
                ary.splice(ndx,1);
              }//if
              //what if there is no menu but there are subs? turn the menu into untitled?

            }
            //valueChecker({"array":icon_keys,"string":target_string,"mod":"string","type":"ans"});
          })
        });//

        //console.log("my starts = ",boss.my_stars);
      }//check_structure



      this.unique = function(arr,val)
      {
        let menu_array  =  arr;
        if(menu_array.length == 0) return true;
        return menu_array.every(function(entry){
        if(boss.insert_mode != "edit"){
          return entry.title !== val;
        }else{
          return (entry.title !== val) ? true : (entry.title == val && entry.id == boss.item_id) ? true : false;
        }
        });//true by default
      }//unique_name

      this.viewMenu = function(sect,tObj)
      {
        //used to enter subtopics of menus and categories
        if(tObj == undefined || tObj == "")
        {
          let stop_the_press = true;
          return;
        }
        if(boss._.menu_category_obj  != "" && boss._.menu_category_obj  != tObj)
        {
          let dont_go_changing = true;
        }

        switch (sect) {
          case "menu":
          //this holds the menus parent category data
            boss.menu_category_id = tObj.id;
            boss.menu_category_src = "category";

            boss._.menu_category_obj  = tObj;
            boss.menu_category_ndx = boss.getItemData(boss.category_array,boss.menu_category_id,
                                      boss.menu_category_src,"index");
            boss.menu_display = "menu";
          break;
          case "submenu":
          //this holds the submenus parent menu data
            boss.submenu_menu_id = tObj.id;
            boss.submenu_menu_src = tObj.src;
            boss._.submenu_menu_obj  = tObj;
            boss.submenu_menu_ndx = boss.getItemData(boss.getCurrentArray("submenu"),boss.submenu_menu_id,
                                    boss.submenu_menu_src,"index");
            boss.menu_display = "submenu";
          break;

        }//switch
        $timeout(function(){
           //console.log("appjs Digest with $timeout");
           boss.prep_elements();
         },0,true)

      }//viewMenu

      /*************   END ITEM SECTION *************/


      /*************  ORDERING SECTION  *************/
      //order section
      //drag section

      //this.object_params = [];
      this.module_list = [];
      this.menu_order = [];
      this.cat_order = [];
      this.first_run = false;
      this.mode;

      //https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

      //https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_draganddrop


      document.addEventListener('DOMContentLoaded', function () {

          //console.log("ordering content loaded running!")
          //boss.prep_elements();
      });

      var last_item = "";
      var last_count = 0;
      var move_obj;
      var menu_order = [];//closure variables

      this.prep_elements = function(ndx,type)
      {
      	//document.querySelector("._cont").addEventListener("dragover",function(event){boss.allowDrop(event)});


        let index = ndx || "none",
        cur_div,
        all_divs;
      //i think this is deprecated
        if(index == "none"){
          all_divs = document.querySelectorAll(".mM_mov");
          if(all_divs == undefined || all_divs.length == 0)return;

        }else{
          let str_name = `.mM_mov_${type}${index}`;
          let targ_el = document.querySelector(str_name)
          all_divs = [document.querySelector(`.mM_mov_${type}${index}`)];
          //console.log(all_divs);
        }


        for(let b = 0; b < all_divs.length; b++){
        	cur_div = all_divs[b];
          cur_div.addEventListener("dragstart",function(event){boss.dragstart_handler(event);});

          cur_div.addEventListener("dragover",function(event){boss.allowDrop(event);});

          cur_div.addEventListener("drop",function(event){boss.drop_handler(event);});

          cur_div.addEventListener("dragenter",function(event){boss.dummy(event,"in");});

          cur_div.addEventListener("dragend",function(event){boss.stop_the_press(event);});


        }//end for

        //boss.item_report();


      }//end prep_elements

      this.prep_assets = function(mod)
      {
        boss.mode = mod;
        ShowData.temp_asset_ids = ShowData.asset_ids.join();
      }//pre_assets


      this.dragstart_handler = function(ev) {
        // Add the drag data
        if(ev.dataTransfer){
        ev.dataTransfer.clearData()
        ev.dataTransfer.setData("text/plain", ev.target.id);

        //console.log(ev.target.id);
        move_obj = document.getElementById(ev.target.id);
        move_obj.className += " ghost";
          //console.log("move class = ",move_obj.className);
        //img test
          //var img = new Image();
        //img.src = 'http://miftyisbored.com/wp-content/uploads/2013/07/autobots-logo-17.jpg';
        //ev.dataTransfer.setDragImage(img, 10, 10);//not working

          ev.dropEffect = "move";

        }//end if
      }//end dragstart_handler

      this.allowDrop = function(ev) {
          ev.preventDefault();
        if(ev.dataTransfer){
           ev.dataTransfer.dropEffect = "move";
        }else{return;}//end if
      }//end allowDrop

      this.drop_handler = function(ev) {
       ev.preventDefault();
          //console.log("drop recognized");
       // Get the id of the target and add the moved element to the target's DOM
       var data = ev.dataTransfer.getData("text");
       let mover = document.getElementById(data);
       let targEl = boss.true_target(ev.target,'moving');
       let moving = targEl.dataset.moving;

        //console.log("dropable = ",targEl.)
        if(mover == undefined){
          let stop_the_press = true;
        }

        boss.placeItem(ev,targEl,mover);
        //move_obj.className = move_obj.className.replace(" ghost","");
        move_obj.className = ShowData.removeSomething(move_obj.className,"ghost"," ");
        move_obj.className = ShowData.removeSomething(move_obj.className," ");
        //removeItem(ev,targEl,"drop");
        //ev.target.appendChild(document.getElementById(data));
        //console.log("move class = ",move_obj.className);

                switch(moving)
                {
                  case "category":
                    //boss.cat_report();
                    boss.tool_report(moving);
                  break;
                  case "menu":
                    //boss.menu_report();
                    boss.item_report(moving);
                  break;
                  case "submenu":
                    boss.sub_report();
                  break;
                }
      }//end drop_handler

      this.true_target = function(targ,dataStr,tp,lv)
      {
        let current_el = targ;
        let lvl = lv || 5;
        let type = tp || "dataset";
        while(current_el && lvl > 0){

          if(type == "dataset" && current_el.dataset[dataStr] != undefined) return current_el;
          if(type == "className" && current_el.className.indexOf(dataStr) != -1) return current_el;

          current_el = current_el.parentNode;
          lvl --;
        }//end while

        return current_el;
      }//true_target

      this.dummy = function(ev,str){
        ev.preventDefault();
        let targEl =  boss.true_target(ev.target,'moving');
        //console.log("my id = ",targEl.id);
        //if(targEl == move_obj){return;}
        //let data = ev.dataTransfer.getData("text");
        ///let mover = document.getElementById(data);


        switch(str)
          {
            case "in":

              //console.log("place in");

              boss.placeItem(ev,targEl,move_obj);

              let moving = targEl.dataset.moving;
                      switch(moving)
                      {
                        case "category":
                          boss.tool_report(moving);
                        break;
                        case "menu":
                          //boss.menu_report();
                          boss.item_report(moving);
                        break;
                        case "submenu":
                          boss.sub_report();
                        break;
                      }

            break;
            case "out":
              //console.log("place out");
              //removeItem(ev,targEl);

            break;
          }
      }//end dummy

      this.placeItem = function(ev,targEl,mover)
      {
        let younger = targEl.nextElementSibling;
        let older = targEl.previousElementSibling;

        let moving = targEl.dataset.moving;
        let bigDaddy = targEl.parentNode;

        if(mover == undefined){
          let stop_the_press = true;
        }

        if(bigDaddy.className.indexOf(`${moving}_dropzone`) == -1)
        {
          return;
        }

        /*
        if(mover == younger){
          bigDaddy.insertBefore(mover,targEl);
        }else if(mover == older && targEl != bigDaddy.lastElementChild){
          bigDaddy.insertBefore(mover,younger);
        }else if(targEl == bigDaddy.lastElementChild && mover == older){
          /*bigDaddy.appendChild(mover);*//* bigDaddy.insertBefore(targEl,mover);
        }else if(targEl != bigDaddy.lastElementChild){
          bigDaddy.insertBefore(mover,younger);
        }else if(targEl == bigDaddy.lastElementChild){
          /*bigDaddy.appendChild(mover);*//* bigDaddy.insertBefore(targEl,mover);
        }*/

        if(targEl != bigDaddy.firstElemetChild || targEl != bigDaddy.lastElementChild ){
          bigDaddy.insertBefore(mover,younger);
        }else if(mover != targEl){
          bigDaddy.insertBefore(mover,targEl);
        }
        /* // doesn't work well with this.
        if(mover == younger){
          bigDaddy.insertBefore(mover,targEl);
        }else if(mover == older && targEl != bigDaddy.lastElementChild){
          bigDaddy.insertBefore(mover,younger);
        }else if(targEl == bigDaddy.lastElementChild && mover == older){
          bigDaddy.appendChild(mover);
        } */

      }//end placeItem

      this.item_report = function(type)
      {
        boss.item_order = [];
        let item_array = document.querySelectorAll(`.${type}_mov`);
        let targ_ary = boss.getCurrentArray(type,"parent");
        let placeholder;

        if(targ_ary == undefined || typeof targ_ary != 'object' || targ_ary == "" )
        {
          let stop_the_press = true;
        }
        boss.get_element_objects(item_array,targ_ary,type).then(function(elData){
          //console.log("el obj thenable running")
          //if the lengths aren't still the same something went wrong. abort.
          if(elData.length !== item_array.length)return;//boss.item_order
          targ_ary[type] = elData;//boss.item_order;
          //console.log(targ_ary);
        });

        //write a function that will parse the id's and reorder the menu array
        //let stringy = boss.item_order.join();
        //ShowData.asset_ids = stringy.split(",");
      }//item_report

      this.tool_report = function(type)
      {
        boss.item_order = [];
        let item_array = document.querySelectorAll(`.${type}_mov`);
        //let targ_ary = boss._.tool.menu_ids;
        let temp_array = [];
        let placeholder;

        item_array.forEach(function(entry){
          temp_array.push(entry.dataset.my_id);
        });

        boss._.tool.menu_ids = temp_array;
        let me_see = boss._.tool.menu_ids;

      }//tool_report

      this.get_element_objects = function(item_array,targ_ary,type)
      {
        return new Promise(function(resolve, reject) {
          //takes element array and gets associated obj data
          let temp_order = []
          item_array.forEach(function(entry,ndx,ary){

            let list_id = entry.dataset.my_id;
            let list_src = entry.dataset.my_src;
            let itemData = boss.getItemData(targ_ary[type],list_id,list_src);

            if(itemData != "none") temp_order.push(itemData);

            if(ndx == ary.length - 1){
                //console.log("el obj ary complete!");
            }
          });

          //console.log("el obj data returning!");
          resolve(temp_order);
        });//Promise
      }//get_element_objects

      this.cat_report = function()
      {
        boss.cat_order = [];
        let cat_array = document.querySelectorAll(`.category_mov`);
        cat_array.forEach(function(entry){

          let list_id = entry.dataset.my_id;
          let list_src = entry.dataset.my_src;
          let catData = boss.getItemData(boss._.tool.params.mega_menu.category,list_id,"category");

          if(catData != "none") boss.cat_order.push(catData);
        });

        //if the lengths aren't still the same something went wrong. abort.
        if(boss.cat_order.length !== cat_array.length)return;
        boss._.tool.params.mega_menu.category = boss.cat_order;

        //write a function that will parse the id's and reorder the menu array
        //let stringy = boss.cat_order.join();
        //ShowData.asset_ids = stringy.split(",");
      }//cat_report


      this.menu_report = function()
      {
        //reset the menu_report
        boss.menu_order = [];

        let every_place = document.querySelectorAll(`.${boss.mode}_mov`);
        let module_id = document.getElementById("jform_module_id").value;

        for(let r = 0;r < every_place.length;r++)
        {
          let list_obj = JSON.parse(every_place[r].dataset.module_data);
          list_obj.order = r;
          if(list_obj.id == module_id){
            document.getElementById("jform_ordering").value = r;
          }

          boss.menu_order.push(list_obj);
        }//end for

        //console.log("list order =",boss.menu_order);
        //boss.module_list = boss.menu_order;
        //document.querySelector(".order_log").innerHTML = "<p>" + menu_order + "</p>" +  document.querySelector(".order_log").innerHTML;
      }//end menu_report

      this.stop_the_press = function(ev)
      {
          //ev.target.className = move_obj.className.replace(" ghost","");
          ev.target.className = ShowData.removeSomething(move_obj.className,"ghost"," ");
          ev.target.className = ShowData.removeSomething(ev.target.className," ");
      }//end stop_the_press

      this.prep_elements();
      //order section

      /*************  END ORDERING SECTION ***********/


      this.update_assets = function(dIDs)
      {
        let comp_ids = [];
        dIDs.forEach(function(entry){
          if(ShowData.asset_reference[entry] != undefined){
            comp_ids.push(ShowData.asset_reference[entry]);
          }//end if
        });
        return comp_ids;
      }

      this.insertCanvas = function(dt,lst,tIUN)
      {
        // note: run .after() with some insert canvas' issue with ng-if and _.refresh_tool
        if(boss._.tool.file_name != "image_menu")return;
        if(dt == undefined)return;

        var inObj = dt;
        let restrict_id = "canvas_img_" + iUN + "_" + inObj.id;
        if(document.querySelector("." + restrict_id) && ShowData.refresh_tool == "false") return;

        let obj_params = (typeof inObj == "string") ? JSON.parse(inObj.params) : inObj;

        let params_str = "params" + inObj.id;
        let last_el = lst;

        // i didn't want to do numbers and create gap indexes so i used a multidim array
        boss.object_params[params_str] = obj_params;
        let obj_str = "bm_canvas_" + iUN + "_"  + inObj.id;
        let asset_id = "imageMenu_img_" + iUN + "_" + inObj.id;//custom id
        let addClass = " " + restrict_id + " imageMenu asset darken ";//d3-w80 d3-h30
        boss.canvas_mkr({name:obj_str,params:obj_params,home:asset_id,class:addClass,adjust:true});

        //console.log("asset_id = ",asset_id);

        if(ShowData.refresh_tool != "false" && last_el == true){
          //if its the last one reset the container & tell it to close;
          //fix: hack - close is also set in template html upon last

          boss.outer_style();

          ShowData.refresh_tool = "close";
        }//end if boss
        //console.log("insert data = ",dt);
      }//insertCanvas

      this.outer_array = [
        "d3_","d3S_","d3M_",
        "d3L_","d3XL_","nav_blog",
        "h_nav","v_nav",
        "d3_hide_small","d3_hide_medium",
        "d3_hide_large","invisible"
      ];

      this.outer_style = function(){
        //this section is designed to style the directive container
        //let queryStr = ".manual-slideshow.tool_default";
        let mt = boss._.tool.module_title;
        console.log("module title = ",mt);

        let queryStr = boss.stage;
        queryStr = "." + ShowData.removeSomething(queryStr,' ');
        let boss_cont = document.querySelector(queryStr);
        let chk_str = boss_cont.className;
        let is_responsive = boss.responsive;
        let scrap = boss.weedOut(chk_str,boss.outer_array,queryStr);

        // let use_style = (boss.mode == "admin") ? parseInt(ShowData.tool.views[boss.view].samp_h_nbr) + "vw": parseInt(ShowData.tool.views[boss.view].h_nbr) + "vw";

        let use_style = boss.form_item_style("outer","get");

        boss_cont.style = use_style;

        if(is_responsive != 1)return;

        let add_class = (boss.mode == "admin" && boss._.preview_display != "max") ? ShowData.tool.views[boss.view].sample_class: ShowData.tool.views[boss.view].custom_class;
        add_ary = add_class.split(" ");
        boss_cont.className = boss.clear_redundacy(boss_cont.className,add_ary);
        let use_class = add_class;// speghetti code ment to erase redundancies in custom_class
        //limit/hide on devices

        if(boss._.tool.views[boss.view].inline && boss.mode == "site"){
          //get the parent moduletable - make it inline ad add width
          let parent_module = boss.true_target(boss_cont,"moduletable","className");
          parent_module.className = ` moduletable inline ${ShowData.tool.views[boss.view].outer.custom_class}`;

          //get the directive parent mod_psmod - make it inline ad add width
          let directive_parent = boss.true_target(boss_cont,"mod_psmod","className");
          directive_parent.style.flex = "1";
        }//if

        //limit/hide on devices

        let hide_small = (boss._.tool.views[boss.view].hide_small == true) ? " d3_hide_small " : "";
        let hide_medium = (boss._.tool.views[boss.view].hide_medium == true) ? " d3_hide_medium " : "";
        let hide_large = (boss._.tool.views[boss.view].hide_large == true) ? " d3_hide_large " : "";

        //restrict action to site/client side display
        let device_limits = (boss.mode != "admin" && boss._.tool.views[boss.view].limit_devices == true) ? ` ${hide_small} ${hide_medium} ${hide_large} ` : "";

        let invisible = (boss.mode != "admin" && boss._.tool.views[boss.view].invisible == true) ? " invisible " : "";


        let newClass = ` ${boss_cont.className} ${use_class} ${device_limits} ${invisible} `;

        boss_cont.className = ShowData.removeSomething(newClass,' ');
        boss_cont.dataset.option_x = "outer";

        let parent_module = boss._.true_target(boss_cont,"moduletable","className");
        if(boss._.exists(boss._.tool.views[boss.view].grid_area_class) && boss.mode == "site"){
          //get the parent moduletable - make it inline ad add width
          let grid_area_class = boss._.tool.views[boss.view].grid_area_class || "";
          parent_module.className = boss.clear_redundacy(parent_module.className,[grid_area_class]);
          parent_module.className = `${parent_module.className} ${grid_area_class}`;
          parent_module.className = ShowData.removeSomething(parent_module.className,' ');
        }// if grid_area_class

        if(boss._.exists(boss._.tool.views[boss.view].grid_area_style) && boss.mode == "site"){
          let grid_area_style = boss._.tool.views[boss.view].grid_area_style || "";
          parent_module.style = `${grid_area_style}`;
          // let par_style = parent_module.style || "";
          // parent_module.style = boss.clear_redundacy(par_style,[grid_area_style]);
          // parent_module.style = ShowData.removeSomething(parent_module.style,' ');
        }// if grid_area_style

      }//outer_style

      this.clear_redundacy = function (cN,rA) {
        let text = cN,
        redundant_array = rA;

        redundant_array.forEach(function (entry) {
          text = text.replace(entry,"");
        })

        return text;
      }// clear_redundacy

      this.getParam = function(data)
      {
        let  targ_data = data;
        let params_str = "params" + targ_data.id;

        if(boss.object_params[params_str] != undefined){
          boss.object_params[params_str] = JSON.parse(targ_data.params);
        }//end if

        let my_params = boss.object_params[params_str];
        //console.log("mega_menu params =",my_params);

        return my_params;

      }//getParam

      this.getClass = function(str)
      {
        let use_class = "";
        let type = (str.match(/custom\d+/g)) ? "custom" : str;
        let target_detail = ShowData.tool.views[boss.view][str];
        let advanced_class = "";

        if(target_detail == undefined){
          let stopper = target_detail;
          return "";
        }

        switch (type) {
          case "outer":
            use_class = (boss.mode == "admin") ? ShowData.tool.views[boss.view].sample_class: ShowData.tool.views[boss.view].custom_class;
            advanced_class = (boss._.exists(target_detail.advanced_class)) ?
        		target_detail.advanced_class : "";

        		use_class = `${use_class} ${advanced_class}`;
          break;

          case "main":
          case "content":
          case "title":
          case "body":
          case "nav":
          case "wrapper":

          if(boss._.exists(target_detail.device_value))
          {
            let device_size_ary = ["small","medium","large","xlarge"];
            let device_size_obj = {"small":"d3S_pw","medium":"d3M_pw","large":"d3L_pw","xlarge":"d3XL_pw"}
            let device_class = "";
            //let flex_class = (target_detail.flex_fill === true) ? "flex_fill" : "";
            //let mobile_margin = (target_detail.mobile_margin === true) ? "mobile_m" : "";
            //let mobile_padding = (target_detail.mobile_padding === true) ? "mobile_p" : "";

            device_size_ary.forEach(function(entry)
            {

                //process the available device json data and forms a string for responsive device widths
                let size_str = "device_" + entry;

                //if its not there skip it
                if(target_detail[size_str] == undefined || target_detail[size_str] == "")return;

                let size_mkr = (target_detail[size_str] != undefined &&
                  target_detail[size_str] != "") ?
                  target_detail[size_str] : "100";
                  let me_seeks_size = target_detail;
                  //console.log("me_seeks_size = ",me_seeks_size);

                  device_class += ` ${device_size_obj[entry]}${size_mkr} `;
              });//forEach


              device_class = ShowData.removeSomething(device_class," ");
              let me_seeks_class = device_class;
              use_class = `${use_class} ${device_class} `

            }//device value

            if(target_detail == undefined || target_detail.custom_class == undefined)
            {
              let hey_class = Starget_detail;
            }
            let cardable = (str == 'content' || str == 'nav')
            advanced_class = (boss._.exists(target_detail.advanced_class)) ?
            target_detail.advanced_class : "";

            use_class = `${use_class} ${target_detail.advanced_class}`;
            use_class = (target_detail.custom_class != undefined) ? ` ${use_class} ${target_detail.custom_class} ` : "";
            use_class = (target_detail.ellipsis === true) ? `${use_class} clamp ` : use_class;
            use_class = (target_detail.card_styling != false) ? `${use_class} w3-card ` : use_class;
            use_class =   (str == "nav" && ShowData.tool.views[boss.view].sticky != undefined &&
            ShowData.tool.views[boss.view].sticky != "none") ? `${use_class} ${ShowData.tool.views[boss.view].sticky} ` : use_class;

            use_class =   (str == "panel" && ShowData.tool.views[boss.view].collapsed === true) ? `${use_class} ${ShowData.tool.views[boss.view].animation} ` : use_class;
            use_class =   (str == "wrapper" && boss._.exists(ShowData.tool.views[boss.view].action) && ShowData.tool.views[boss.view].action != "push") ? `${use_class} ${ShowData.tool.views[boss.view].action} ` : use_class;

            use_class = ShowData.removeSomething(use_class," ");
          break;

          case "list":
          case "list2":
          case "button":
          case "logo":
          case "logo2":
            //use_class = (ShowData.tool.views[boss.view][str].shadow_mode === true) ? ` ${ShowData.tool.views[boss.view][str].shadow} ` : "";
            use_class = (ShowData.tool.views[boss.view][str].width_control === true) ? `${use_class} d3_pw${ShowData.tool.views[boss.view][str].width_pct} ` : use_class;
            advanced_class = (boss._.exists(target_detail.advanced_class)) ?
        		target_detail.advanced_class : "";

        		use_class = `${use_class} ${advanced_class}`;
            use_class += ` ${ShowData.tool.views[boss.view][str].custom_class} `;
            use_class = (ShowData.tool.views[boss.view][str].card_styling != false) ? `${use_class} w3-card ` : use_class;

            //limit/hide on devices
            if(str == "logo" || str == "logo2"){
              let hide_small = (boss._.tool.views[boss.view][str].hide_small == true) ? " d3_hide_small " : "";
              let hide_medium = (boss._.tool.views[boss.view][str].hide_medium == true) ? " d3_hide_medium " : "";
              let hide_large = (boss._.tool.views[boss.view][str].hide_large == true) ? " d3_hide_large " : "";

              //restrict action to site/client side display
              let device_limits = (boss.mode != "admin" && boss._.tool.views[boss.view][str].limit_devices == true) ? ` ${hide_small} ${hide_medium} ${hide_large} ` : "";
              use_class = ` ${use_class} ${device_limits} `;
            }//if
            use_class = ShowData.removeSomething(use_class," ");
          break;

          default:
          advanced_class = (boss._.exists(target_detail.advanced_class)) ?
          target_detail.advanced_class : "";

          use_class = `${use_class} ${advanced_class}`;
          use_class = (boss.mode == "admin") ? `${use_class} ${ShowData.tool.views[boss.view].sample_class}`: `${use_class} ${ShowData.tool.views[boss.view].custom_class}`;
          use_class = ShowData.removeSomething(use_class," ");
        }
        return use_class;
      }//getClass

      this.getStyle = function()
      {
        let use_style = (boss.mode == "admin") ? ShowData.tool.views[boss.view].samp_h_nbr: ShowData.tool.views[boss.view].h_nbr;

        //return `min-height:${ShowData.tool.views[boss.view].height}px;`;
        return (ShowData.tool.views[boss.view].height_style == 'strict') ? `height:${ShowData.tool.views[boss.view].height}px;` : "";
      }//getStyle

      this.getStyle_OG = function()
      {
        let use_style = (boss.mode == "admin") ? ShowData.tool.views[boss.view].samp_h_nbr: ShowData.tool.views[boss.view].h_nbr;

        return `min-height:${use_style}vw;`;
      }//getStyle_OG

      this.weedOut = function(str,srch,qSel)
      {
        /*this function takes out unwanted css classes from the elements classNames by referencing
        an array of possible unwanted strings*/
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
          scratchy.className = ShowData.removeSomething(scratchy.className,' ');
        }//end if
        return weedAry.join(" ");
      }//weedOut


      this.setListHover = function(eID,dest)
      {
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
      }

      this.item_hover = function(str,dest,tTDS)
      {
        let targ_el = (tTDS != undefined) ? boss.true_target(event.target,tTDS) : event.target;
        let targ_icon = (targ_el.getElementsByTagName('i')) ? targ_el.getElementsByTagName('i') : "none";
        switch (str) {
          case "in":
            targ_el.style.cursor = "pointer";
            targ_el.style.backgroundColor = `${boss._.tool.views[boss.view][dest].bg_hov_hex}`;
            targ_el.style.color = `${boss._.tool.views[boss.view][dest].font_hov_color}`;
            if(targ_icon != "none"){

            }

          break;
          case "out":
            targ_el.style.cursor = "auto";
            targ_el.style.backgroundColor = `${boss._.tool.views[boss.view][dest].bg_hex}`;
            targ_el.style.color = `${boss._.tool.views[boss.view][dest].font_color}`;
          break;
        }//switch
      }//item_hover

      this.image_object_converter = function(cpar)
      {
        let data = cpar;
        if(data.img_obj != undefined && data.img_obj[0] == undefined)
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


      this.canvas_mkr = function(cObj)
      {
        //cObj.restrict != undefined to prevent error on undefined property
        if(cObj.restrict != undefined && document.querySelector("." + cObj.restrict) && ShowData.refresh_tool == "false" ) return;

        //if home doesn't exist go back
        let check_home = (document.getElementById(cObj.home)) ? document.getElementById(cObj.home) : document.getElementsByClassName(cObj.home)[0];
        if(check_home == undefined)return;

        let can_home = cObj.home;
        let crew_obj = ShowData.tool;//JSON.parse(unescape(boss.crew));
        let can_params = cObj.params;

        //legacy converter
        boss.image_object_converter(can_params);


        let can_custom_class = cObj.class || "";
        //let img_nbr = 0;//setup to become dynamic
        let img_nbr = boss.select_image_ndx(can_params);//boss.view

        let can_url = can_params.img_obj[img_nbr].url;
        let can_w = (can_params.img_obj[img_nbr].canvas != undefined && can_params.img_obj[img_nbr].canvas.width != "") ?
        can_params.img_obj[img_nbr].canvas.width :
        (can_params.canvas != undefined && can_params.canvas.width != "")
        ? can_params.canvas.width : ShowData.canvas.landscape.w;
        let can_h = (can_params.img_obj[img_nbr].canvas != undefined && can_params.img_obj[img_nbr].canvas.height != "") ?
        can_params.img_obj[img_nbr].canvas.height :
        (can_params.canvas != undefined && can_params.canvas.height != "")
        ? can_params.canvas.height : ShowData.canvas.landscape.h;
        let can_restrict = cObj.restrict || "";
        let can_class = cObj.class || "";
        can_class += " " + can_restrict + " ";
        //console.log("crew styles = ",crew_obj.views[boss.view].custom_class);
        //can_class += " " + crew_obj.views[boss.view].custom_class + " ";
        let use_class = (boss.mode == "admin") ? crew_obj.views[boss.view].sample_class : crew_obj.views[boss.view].custom_class ;
        //can_class += " " + use_class + " ";
        can_class = ShowData.removeSomething(can_class,' ');
        let can_name = cObj.name;//variable name
        let adjust = cObj.adjust || false;

        if(adjust != false){
          can_class += (parseInt(can_w) <= parseInt(can_h)) ? " portrait " : "";
        }//end if

        boss.object_elements[can_name] = new masterImage({home:can_home,varName:can_name,url:can_url,type:"banner",
        width:can_w,height:can_h});//looks like this controls the resolution
    		boss.object_elements[can_name].setCustomClass(can_class);
        boss.object_elements[can_name].setRawDisplay();
        if(can_params.img_obj[img_nbr].canvas_data != undefined && can_params.img_obj[img_nbr].canvas_data != "" && can_params.img_obj[img_nbr].canvas_data != {})
        {
          boss.object_elements[can_name].setView(can_params.img_obj[img_nbr].canvas_data);
        }
        //boss.object_elements[can_name].setFitDisplay();
        boss.object_elements[can_name].clearHome("true");
        boss.object_elements[can_name].display();

        var asset_img_array = boss.object_elements[can_name].get_event_ids();
        var asset_img_id = asset_img_array[0];


        if(ShowData.refresh_tool == "close"){
          //if i make changes this tell the program its ok to redo all the canvases
          //if i ever use canvase with the setting mode i will have to filter this with mode == default
          $timeout(function(){
             //console.log("appjs Digest with $timeout");

          },0,true).then(function(){
            //console.log("loader is off");
            //ShowData.loader = 0;
            ShowData.refresh_tool = "false";

          });
        }

      }//end canvas_mkr

      //var slideIndex = 1;

      this.simple_canvas = function(home_str,sObj,ndx)
      {
        let restrict_id = "simple_canvas_img" + ndx;

        let mesee_all = document.querySelectorAll(".imageMenu_img");

        if(document.querySelector("." + restrict_id)) return;
        if(sObj == undefined)return;
        let simple_object = sObj;

        let can_json = (typeof simple_object.canvas_json == "string") ? JSON.parse(simple_object.canvas_json) : simple_object.canvas_json;
        if(can_json == undefined)return;

        boss.addClass = (parseInt(can_json.canvas_width) <= parseInt(can_json.canvas_height)) ? " portrait " : "";
        boss.addClass += ` ${restrict_id} `;

        // if the home doesn't exist go back til it does
        if(!document.getElementById(`${home_str}`) && !document.querySelector(`.${home_str}`)){
          return;
        }

        boss.object_elements.simp_can = new masterImage({home:home_str,varName:"simp_can",url:simple_object.url,type:"banner",
        width:300,height:300});//,mode:"center"; looks like this controls the resolution
    		boss.object_elements.simp_can.setCustomClass("simp_can " + boss.addClass);

        //let me_seeks = Object.keys(boss.ShowData.img_obj).length;
        //let me_seeks2 = boss.ShowData.img_obj[img_nbr].constructor;
        //if(Object.keys(boss.ShowData.img_obj).length !== 0 && boss.ShowData.img_obj[img_nbr].constructor === Object)
        //{
          //let mesee1 = unescape(boss.ShowData.url);
          //let mesee2 = unescape(boss.ShowData.img_obj[img_nbr].url);
          //let same_image = (unescape(boss.ShowData.url) == unescape(boss.ShowData.img_obj[img_nbr].url)) ? true : false;
          //if(same_image === true){
            boss.object_elements.simp_can.setView(simple_object.canvas_data);
          //}//if
        //}
        boss.object_elements.simp_can.setRawDisplay();
        //boss.object_elements.simp_can.setFitDisplay();
        boss.object_elements.simp_can.display();


        var simp_can_array = boss.object_elements.simp_can.get_event_ids();
        var simp_can_id = simp_can_array[0];
      }//end simple_canvas


      this.image_picker = function(dObj)
      {
        let data_obj = dObj;
        data_obj = boss.image_object_converter(data_obj);
        let image_object = data_obj.img_obj;
        //distinguish between mobile and not mobile and send the appropriate images

        return image_object[0];

      }//image_picker

      this.getDetails = function(dest,attr)
      {
        return boss._.tool.views[boss.view][dest][attr];
      }//getDetails

      this.plusDivs = function(n) {
        if(boss.initiated == false)return;
        boss.showDivs(slideIndex += n);
      }

      this.showDivs = function(n) {
        var i;
        //let cls_str = "mySlides" + iUN;
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

      this.process_size = function()
      {
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
          let c_w = ShowData.tool.views[boss.view].width;
          let c_h = ShowData.tool.views[boss.view].height;//this is the user set dimensions

          let auto_width = ShowData.tool.views[boss.view].auto_width;
          //let width_pct = parseFloat("." + ShowData.tool.views[boss.view].width_pct);
          let width_pct = ShowData.tool.views[boss.view].width_pct;

          let orient = (c_w == c_h) ? "square" : (c_w > c_h) ? "landscape"  : "portrait";

          let is_responsive = boss.responsive;
          //console.log("process_size responsive = ",boss.responsive);

          //if responsive or if <= use the responsive classes
          //process width
          if(is_responsive == 1)
          {
            //if(c_w <= s_w && c_h <= s_h ) use the ratio if its bigger than the page
            //if its bigger than the screen height - use c_h to s_h
            ShowData.tool.views[boss.view].ratio = boss.get_ratio(c_w,c_h);
            let the_ratio = ShowData.tool.views[boss.view].ratio.split(":");
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

            ShowData.tool.views[boss.view].w_class = w_class;
            ShowData.tool.views[boss.view].h_class = h_class;
            ShowData.tool.views[boss.view].w_nbr = w_nbr;
            ShowData.tool.views[boss.view].h_nbr = h_nbr;
            ShowData.tool.views[boss.view].samp_w_class = samp_w_class;
            ShowData.tool.views[boss.view].samp_h_class = samp_h_class;
            ShowData.tool.views[boss.view].samp_w_nbr = samp_w_nbr;
            ShowData.tool.views[boss.view].samp_h_nbr = samp_h_nbr;

            ShowData.tool.views[boss.view].class_style = " " + w_class + " ";
            ShowData.tool.views[boss.view].class_alt = " " + samp_w_class + " ";

            let custom_class = " " + ShowData.tool.views[boss.view].class_pfx + " " + ShowData.tool.views[boss.view].class_style + " ";
            custom_class = ShowData.removeSomething(custom_class,' ');
            let sample_class = " " + ShowData.tool.views[boss.view].class_pfx + " " + ShowData.tool.views[boss.view].class_alt + " ";
            sample_class = ShowData.removeSomething(sample_class,' ');

            ShowData.tool.views[boss.view].custom_class = custom_class;
            ShowData.tool.views[boss.view].sample_class = sample_class;

            let custom_style = `min-height:${ShowData.tool.views[boss.view].height}px !important`;
            let sample_style = `min-height:${ShowData.tool.views[boss.view].height}px !important`;
            ShowData.tool.views[boss.view].custom_style = "";//custom_style;
            ShowData.tool.views[boss.view].sample_style = "";//sample_style;


            //console.log("class style = ",ShowData.tool.views[boss.view].class_style);
            //console.log("class alt = ",ShowData.tool.views[boss.view].class_alt);
          }else {
            ShowData.tool.views[boss.view].custom_class = "";
            ShowData.tool.views[boss.view].sample_class = "";
          }
          //end if boss.mode
          boss.outer_style();

          ShowData.refresh_tool = "true";
        }

      }//process_size


      this.process_size_OG = function()
      {
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
          let c_w = ShowData.tool.views[boss.view].width;
          let c_h = ShowData.tool.views[boss.view].height;//this is the user set dimensions

          let auto_width = ShowData.tool.views[boss.view].auto_width;
          let width_pct = parseFloat("." + ShowData.tool.views[boss.view].width_pct);

          let orient = (c_w == c_h) ? "square" : (c_w > c_h) ? "landscape"  : "portrait";

          let is_responsive = boss.responsive;
          //console.log("process_size responsive = ",boss.responsive);

          //if responsive or if <= use the responsive classes
          //process width
          if(is_responsive == 1)
          {
            //if(c_w <= s_w && c_h <= s_h ) use the ratio if its bigger than the page
            //if its bigger than the screen height - use c_h to s_h
            ShowData.tool.views[boss.view].ratio = boss.get_ratio(c_w,c_h);
            let the_ratio = ShowData.tool.views[boss.view].ratio.split(":");
            let w_ratio = the_ratio[0];
            let h_ratio = the_ratio[1];

            //get % of screen width

            let w_pct,h_pct;
            switch(orient)
            {
              case "square":
              w_pct = (c_w <= s_w) ? c_w / s_w : .95;
              w_pct = (w_pct > .95) ? .95 : w_pct;//make sure it doesn't exceed 95
              w_pct = (auto_width != false) ? width_pct : w_pct;

              h_pct = w_pct;
              break;

              case "portrait":
              //right now he purpose is for displays that fit in the viewport window.
              //i need the s|c_h converted into screen width measurements - the h is naturally x s|c_w
              //then i want to know what % of the available h the users wants to use
              h_pct = (c_w <= s_w) ? c_h / s_w : c_h / c_w;
              h_pct = (h_pct > .95) ? .95 : h_pct;//make sure it doesn't exceed 95

              w_pct = h_pct / h_ratio;
              break;

              case "landscape":
                w_pct = (c_w <= s_w) ? c_w / s_w : .95;
                w_pct = (w_pct > .95) ? .95 : w_pct;//make sure it doesn't exceed 95
                w_pct = (auto_width != false) ? width_pct : w_pct;

                h_pct = w_pct / w_ratio;
              break;
            }//switch

            let w_nbr = boss.rounded(w_pct);
            let w_class = " d3S_w" + w_nbr;//" d3S_w" + w_nbr;
            let h_nbr = boss.rounded(h_pct);
            let h_class = "d3S_h" + h_nbr;// "d3S_h" + h_nbr;

            let samp_w_nbr = parseInt(boss.rounded(w_pct * .80));
            let samp_w_class = " d3S_w" + samp_w_nbr;// " d3S_w" + samp_w_nbr;
            let samp_h_nbr = parseInt(boss.rounded(h_pct  * .60));
            let samp_h_class = "d3S_h" + samp_h_nbr;//"d3S_h" + samp_h_nbr;

            ShowData.tool.views[boss.view].w_class = w_class;
            ShowData.tool.views[boss.view].h_class = h_class;
            ShowData.tool.views[boss.view].w_nbr = w_nbr;
            ShowData.tool.views[boss.view].h_nbr = h_nbr;
            ShowData.tool.views[boss.view].samp_w_class = samp_w_class;
            ShowData.tool.views[boss.view].samp_h_class = samp_h_class;
            ShowData.tool.views[boss.view].samp_w_nbr = samp_w_nbr;
            ShowData.tool.views[boss.view].samp_h_nbr = samp_h_nbr;

            ShowData.tool.views[boss.view].class_style = " " + w_class + " ";
            ShowData.tool.views[boss.view].class_alt = " " + samp_w_class + " ";

            let custom_class = " " + ShowData.tool.views[boss.view].class_pfx + " " + ShowData.tool.views[boss.view].class_style + " ";
            custom_class = ShowData.removeSomething(custom_class,' ');
            let sample_class = " " + ShowData.tool.views[boss.view].class_pfx + " " + ShowData.tool.views[boss.view].class_alt + " ";
            sample_class = ShowData.removeSomething(sample_class,' ');

            ShowData.tool.views[boss.view].custom_class = custom_class;
            ShowData.tool.views[boss.view].sample_class = sample_class;

            let custom_style = `min-height:${h_nbr}vw !important`;
            let sample_style = `min-height:${samp_h_nbr}vw !important`;
            ShowData.tool.views[boss.view].custom_style = "";//custom_style;
            ShowData.tool.views[boss.view].sample_style = "";//sample_style;


            //console.log("class style = ",ShowData.tool.views[boss.view].class_style);
            //console.log("class alt = ",ShowData.tool.views[boss.view].class_alt);
          }else {
            ShowData.tool.views[boss.view].custom_class = "";
            ShowData.tool.views[boss.view].sample_class = "";
          }
          //end if boss.mode
          boss.outer_style();

          ShowData.refresh_tool = "true";
        }

      }//process_size_OG


      this.get_ratio = function(w,h)
      {
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

      this.prep_color = function(mod,dest,param)
      {
        let targ_el = event.target;
        boss.prep_color2(targ_el.value,mod,dest,param)
        //return arguments.length ? (_name = newName) : _name;//I like this shortcut
      }//prep_color

      //hack for color.ctrlr.js
      this.prep_color2 = function(val,mod,dest,param)
      {
            //i need to compile the new color
            boss.form_item_color(val,mod,dest,param);
            boss.form_item_style(dest);
            //$scope.$digest();

        //return arguments.length ? (_name = newName) : _name;//I like this shortcut
      }//prep_color2

      this.prep_height = function(dest,cls)
      {
        let targ_el = event.target;
            //i need to compile the new color
            boss.form_btn_height(targ_el.value,dest,cls);
            //boss.form_item_style();
            $timeout(function(){},0,true);

        //return arguments.length ? (_name = newName) : _name;//I like this shortcut
      }//prep_height

      this.form_btn_height = function(dat,dest,cls)
      {
        //what if its empty or brand new and angular is just digesting?
        if(dat == undefined && dest == undefined && cls == undefined) return;
        let active_width = boss._.tool.views[boss.view][dest].active_width;
        if(dat == undefined || active_width === false)return;
          let btn_grp = document.querySelectorAll(".bM_read_more");
          let new_class = ` ${cls}${dat} `;

          btn_grp.forEach(function(entry){
            let dirty_class = entry.className;
            let clean_class = boss.weedOut(dirty_class,["d3_","d3S_","d3M_","d3L_","d3XL_"]);
            let class_final = clean_class + new_class;
            entry.className = ShowData.removeSomething(class_final,' ');
          });

      }//form_btn_height

      this.form_item_color = function(dat,mod,dest,pref)
      {
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

      this.form_item_style = function(dest,mod)
      {

            //let width = `width:${boss._.tool.views[boss.view].width_pct}%;`;
            let target_detail = boss._.tool.views[boss.view][dest];

            if(target_detail == undefined){
              let stopper = target_detail;
              return "";
            }

            let display = (target_detail.display != undefined && target_detail.display != "") ?
            `display:${target_detail.display};` :  "" ;

            let position = (target_detail.position == undefined && target_detail.position == "") ?  "" :
            `position:${target_detail.position};`;

            let width = "";
            let height_ctrl = target_detail.height_control || false;
            let height = "";
            let txt_color = "";
            let bg_color = `background-color:${boss._.tool.views[boss.view][dest].bg_hex};`;
            let margin = "";
            let padding = "";
            let mode = mod || "default";

            let margin_measure = boss._.tool.views[boss.view][dest].margin_measure || "rem";
            let padding_measure = boss._.tool.views[boss.view][dest].padding_measure || "rem";

            /*margin = ["margin: ",boss._.tool.views[boss.view][dest].margin_top,`${margin_measure} `,
            boss._.tool.views[boss.view][dest].margin_right,`${margin_measure} `,
            boss._.tool.views[boss.view][dest].margin_bottom,`${margin_measure} `,
            boss._.tool.views[boss.view][dest].margin_left,`${margin_measure}; `].join("");
            */
            let m_lft = (dest == "outer" && boss._.tool.views[boss.view][dest].margin_left == boss._.tool.views[boss.view][dest].margin_right) ?
            " auto " :  ` ${boss._.tool.views[boss.view][dest].margin_left}${margin_measure} `;
            let m_rgt = (dest == "outer" && boss._.tool.views[boss.view][dest].margin_left == boss._.tool.views[boss.view][dest].margin_right) ?
            " auto " :  ` ${boss._.tool.views[boss.view][dest].margin_right}${margin_measure} `;

              margin = ["margin: ",boss._.tool.views[boss.view][dest].margin_top,`${margin_measure} `,
              m_rgt,
              boss._.tool.views[boss.view][dest].margin_bottom,`${margin_measure} `,
              m_lft,`; `].join("");

            padding = ["padding: ",boss._.tool.views[boss.view][dest].padding_top,`${padding_measure} `,
            boss._.tool.views[boss.view][dest].padding_right,`${padding_measure} `,
            boss._.tool.views[boss.view][dest].padding_bottom,`${padding_measure} `,
            boss._.tool.views[boss.view][dest].padding_left,`${padding_measure}; `].join("");

            if(dest == "list" || dest == "list2"){

              margin_calc = boss._.tool.views[boss.view][dest].margin_top + boss._.tool.views[boss.view][dest].margin_bottom;

              padding_calc = boss._.tool.views[boss.view][dest].padding_top + boss._.tool.views[boss.view][dest].padding_bottom;

              boss._.tool.views[boss.view][dest].outer_calc = margin_calc + padding_calc;

            }

            let border_style = "";
            if(boss._.tool.views[boss.view][dest].active_border == true){
              border_style = [`border:solid ${boss._.tool.views[boss.view][dest].border_color};`,
              ` border-radius:${boss._.tool.views[boss.view][dest].border_radius}px; `,
              "border-width: ",
              `${boss._.tool.views[boss.view][dest].border_width_top}px ` ,
              `${boss._.tool.views[boss.view][dest].border_width_right}px `,
              `${boss._.tool.views[boss.view][dest].border_width_bottom}px `,
              `${boss._.tool.views[boss.view][dest].border_width_left}px ;`].join("");
            }

            let column = "";
            if(dest == "content")
            {
              let column_width_ary = ["90","90","45","30","22","18","15"];
              let column_size_ary = ["small","medium","large","xlarge"];
              let column_size_obj = {"small":"d3S_pw","medium":"d3M_pw","large":"d3L_pw","xlarge":"d3XL_pw"}
              let col_class = "";
              let flex_class = (boss._.tool.views[boss.view][dest].flex_fill === true) ? "flex_fill" : "";
              let mobile_margin = (boss._.tool.views[boss.view][dest].mobile_margin === true) ? "mobile_m" : "";
              let mobile_padding = (boss._.tool.views[boss.view][dest].mobile_padding === true) ? "mobile_p" : "";

              column_size_ary.forEach(function(entry){

                //process the available column json data and forms a string for responsive column widths
                let size_str = "column_" + entry;
                let size_mkr = (column_width_ary[boss._.tool.views[boss.view][dest][size_str]] != undefined &&
                  column_width_ary[boss._.tool.views[boss.view][dest][size_str]] != "") ?
                  column_width_ary[boss._.tool.views[boss.view][dest][size_str]] : "90";
                  let me_seeks_size = boss._.tool.views[boss.view][dest];
                  //console.log("me_seeks_size = ",me_seeks_size);

                  col_class += ` ${column_size_obj[entry]}${size_mkr} `;
              });//forEach

              col_class += ` ${flex_class} ${mobile_margin} ${mobile_padding} `;


              col_class += (height_ctrl == true && target_detail.height_pct != undefined ||
              height_ctrl == "percent" &&target_detail.height_pct != undefined) ?
              ` d3S_ph${target_detail.height_pct} ` :  "";

              col_class = ShowData.removeSomething(col_class," ");
              let me_seeks_class = boss._.tool.views[boss.view][dest].custom_class;
              //console.log("me_seeks_class = ",me_seeks_class);

              boss._.tool.views[boss.view][dest].custom_class = col_class;
            }else if(dest == "outer")
            {//add nav later
              let column_width_ary = ["90","90","45","30","22","18","15"];
              let column_size_ary = ["small","medium","large","xlarge"];
              let column_size_obj = {"small":"d3S_pw","medium":"d3M_pw","large":"d3L_pw","xlarge":"d3XL_pw"}
              let col_class = "";
              let flex_class = (boss._.tool.views[boss.view][dest].flex_fill === true) ? "flex_fill" : "";
              let mobile_margin = (boss._.tool.views[boss.view][dest].mobile_margin === true) ? "mobile_m" : "";
              let mobile_padding = (boss._.tool.views[boss.view][dest].mobile_padding === true) ? "mobile_p" : "";

              column_size_ary.forEach(function(entry){

                //process the available column json data and forms a string for responsive column widths
                let size_str = "column_" + entry;
                let size_mkr = (boss._.tool.views[boss.view][dest][size_str] != undefined &&
                  boss._.tool.views[boss.view][dest][size_str] != "") ?
                  boss._.tool.views[boss.view][dest][size_str] : "90";
                  let me_seeks_size = boss._.tool.views[boss.view][dest];
                  //console.log("me_seeks_size = ",me_seeks_size);

                  col_class += ` ${column_size_obj[entry]}${size_mkr} `;
              });//forEach

              col_class += ` ${flex_class} ${mobile_margin} ${mobile_padding} `
              col_class = ShowData.removeSomething(col_class," ");
              let me_seeks_class = boss._.tool.views[boss.view][dest].custom_class;
              //console.log("me_seeks_class = ",me_seeks_class);

              boss._.tool.views[boss.view][dest].custom_class = col_class;
            }else {

              let mobile_margin = (boss._.tool.views[boss.view][dest].mobile_margin === true) ? "mobile_m" : "";
              let mobile_padding = (boss._.tool.views[boss.view][dest].mobile_padding === true) ? "mobile_p" : "";

              let c_class = ` ${mobile_margin} ${mobile_padding} `;

              //can i make this universal and let device size options override this?
              let has_width = (boss._.tool.views[boss.view][dest].width_control != undefined &&
                boss._.tool.views[boss.view][dest].width_control == true) ? true : false;

              c_class += ( has_width && boss._.tool.views[boss.view][dest].width_pct != undefined ) ?
              ` d3_pw${boss._.tool.views[boss.view][dest].width_pct} ` : "" ;

              c_class += (height_ctrl == true && target_detail.height_pct != undefined ||
              height_ctrl == "percent" && target_detail.height_pct != undefined ) ?
              ` d3_ph${target_detail.height_pct} ` : "" ;

              c_class = ShowData.removeSomething(c_class," ");

              boss._.tool.views[boss.view][dest].custom_class = c_class;
            }

            let justify = (target_detail.justify != undefined && target_detail.justify != "") ?
            ` justify-content:${target_detail.justify}; ` : "";

            let align = (target_detail.align != undefined && target_detail.align != "") ?
            ` align-items:${target_detail.align}; ` : "";

            let flow = (target_detail.flow != undefined && target_detail.flow != "") ?
            ` flex-flow:${target_detail.flow}; ` : "";

            let drop = "";
            if(dest == "panel")
            {
              /*
              let iHt = boss._.tool.views[boss.view].nav.item_height || "";
              iHt = (iHt != undefined && iHt !== 0 && iHt != "" ) ? iHt : "none";
              let lNbr = boss._.tool.views[boss.view].nav.line_number || "";
              lNbr = ( lNbr !=undefined && lNbr !== 0 && lNbr != "") ? lNbr : "none";
              let nav_height = (iHt != 'none'&&  lNbr != 'none') ? iHt * lNbr : 'none';
              drop = (boss._.tool.views[boss.view].collapsed == true && boss._.tool.views[boss.view].action == "overlay" && nav_height != "none") ?
              `position:absolute; top:${nav_height}${boss._.tool.views[boss.view].button.font_measure}; z-index:50;` : "";
              */
              let menu_collapsed = boss._.tool.views[boss.view].collapsed || true;
              let menu_action = boss._.tool.views[boss.view].action || "overlay";
              let max_hgt = (
                boss._.exists(target_detail.height_control) &&
                boss._.exists(target_detail.height) &&
                boss._.exists(target_detail.height_measure)
              ) ? `max-height:${target_detail.height}${target_detail.height_measure};` :
              "";

              drop = (menu_collapsed == true && menu_action == "overlay") ? `position:absolute; top:0; z-index:50;` :
              (menu_collapsed == true && menu_action == "fixed") ? `overflow-y:scroll; ${max_hgt}` :
               "";
            }

            //main dropdown doesn't need a height
            // outer height is disabled here
            let is_target = (dest == "main" || dest == "outer") ? true : false;
            let has_height = (!is_target ||
            is_target && boss._.tool.views[boss.view].action == undefined ||
            is_target && boss._.tool.views[boss.view].action == "fixed") ? true : false;

            height = (has_height == true && height_ctrl == "direct" && target_detail.height != undefined &&
            target_detail.height_measure != undefined) ?
            height = `height:${target_detail.height}${target_detail.height_measure}; ` :
            "";

            let advanced_style = (boss._.exists(target_detail.advanced_style)) ?
              target_detail.advanced_style : "";

            target_detail.style = display + width + height + bg_color + margin + border_style + padding + txt_color + justify + align + flow + drop + advanced_style;

            boss._.tool.views[boss.view][dest].style = ShowData.removeSomething(target_detail.style ," ");

            if(boss._.tool.views[boss.view][dest].auto_same_paddings != undefined)
            {delete boss._.tool.views[boss.view][dest].auto_same_paddings}

            //boss._.tool.views[boss.view][dest].btn_style = "background-color:" + boss._.tool.views[boss.view].btn_hex + " !important;";
            let ready_style = boss._.tool.views[boss.view][dest].style;
            //console.log("mM_style",ready_style);

            //lets see
            if(dest == "wrapper"){
              let meseeks = dest;
            }//if

            if(dest == "main" || dest == "nav"){
              boss.outer_style();
            }//if

            if(mode == "default"){
              boss.refresh();
            }else {
              return ready_style;
            }//else
      }//form_item_style

      this.prep_main  = function(ndx)
      {
        let main_str = `imageMenu_menu_cont_${ndx}`;
        if(boss.object_elements[main_str] == undefined){
          boss.object_elements[main_str] = {};
          boss.object_elements[main_str].collapsed = (boss._.tool.views[boss.view].menu_bar == true) ? true : false;
        }
      }//prep_main

      this.toggle_show = function(ndx)
      {
        let main_str = `imageMenu_menu_cont_${ndx}`;
        let main_array = Object.keys(boss.object_elements);
        boss.last_menu = `imageMenu_menu_cont_${ndx}`;
        main_array.forEach(function(entry){
          if(main_str == entry){
            boss.object_elements[entry].collapsed = (boss.object_elements[entry].collapsed == true) ? false : true;
          }else {
            boss.object_elements[entry].collapsed = true;
          }
        })

      }//toggle_show

      this.is_collapsed = function(ndx)
      {
          let main_str = `imageMenu_menu_cont_${ndx}`;

          //see also toggle_show above
          return (boss._.tool.views[boss.view].nav.display != 'none' &&
          boss._.tool.views[boss.view].button.active_button == true) ?
          boss.object_elements[main_str].collapsed : false;
      }//is_collapsed

      this.collapse_all = function()
      {
        let menu_keys = Object.keys(boss.object_elements);
        menu_keys.forEach(function(entry){
          boss.object_elements[entry].collapsed = true;
        })
      }// collapse_all

      this.make_margin = function(dest,mod,dest2)
      {
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
        let padding_str,padding_boxes;

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

      // this.test_link = function(lObj,fc)
      // {
      //   //test_link check to see if the item is linkable first
      //   let force = fc || false;
      //   let link_data = boss.getDisplayData(lObj,'url');
      //   let link = link_data || "";
      //   let active = (lObj.active_link != undefined) ? lObj.active_link : true;
      //   if(force == false && active !== true || link == "")return;
      //   //window.location.replace(lnk);
      //   boss.link(link);
      // }//test_link

      this.test_link = function(tObj)
      {
        //test_link check to see if the item is linkable first
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
      }//link

      this.link = function(lnk)
      {
        //window.location.replace(lnk);
        window.location.href = lnk;

      }//link


      this.make_columns = function(dest,mod,dest2)
      {
        let column_str,column_boxes;

        switch (dest) {
        case "all":
        /*
          let mod_str = "." + mod;
          let chkAll = document.querySelector(mod_str);
          column_str = `.${dest2}_column`;
          column_boxes = document.querySelectorAll(column_str);

          if(chkAll.checked)
          {
            column_boxes.forEach(function(entry){
              entry.checked = true;
            });
            //boss._.tool.views[boss.view][dest].auto_same_columns = false;
          }else {
            column_boxes.forEach(function(entry){
              entry.checked = false;
            });
            //boss._.tool.views[boss.view][dest].auto_same_columns = true;
          }
          */
        break;

        default:
        column_str = `.${dest}_column_box`;
        column_boxes = document.querySelectorAll(column_str);
        column_boxes.forEach(function(entry){
          if(entry.checked)
          {
            let el_param = entry.dataset.param;
            boss._.tool.views[boss.view][dest][el_param] = boss._.tool.views[boss.view][dest].column_value;
          }
        });

        boss.form_item_style(dest);
      }//switch


    }//make_columns

    this.getDisplayData = function(obj,dest,ndx)
    {
      let targ_obj = obj;
      let display_data = "";
      let custom_data = "";//user customized title
      let og_data = "";// taken straight from original item
      let obj_data = "";//possibly inaccurate - may have been updated in original item since it was saved

      switch (dest) {
        case 'title':
          custom_data = obj.custom_title;
          try{
            //just in case it has trouble finding it
            if(obj.src != "custom" && obj.src != "category")
            {
              //the asset section checks for the existence of title text if it doesn't exist it will use
              //the name of the asset. ultimately if any is returned undefined or blank it will use other sources
              og_data = (obj.src == "page") ? boss.service[`${obj.src}_reference_details`][obj.id].title :
              (obj.src == "asset" && boss.service[`${obj.src}_reference_details`][obj.id].text.head.text != undefined
              && boss.service[`${obj.src}_reference_details`][obj.id].text.head.text != "") ?
              boss.service[`${obj.src}_reference_details`][obj.id].text.head.text :
              boss.service[`${obj.src}_reference_details`][obj.id].title;

            }
           }catch(err){
            console.log("no getDisplayData",err);
          }//catch
          obj_data = obj.title;
          display_data = (custom_data != undefined && custom_data != "") ? custom_data :
          (og_data != undefined && og_data != "") ? og_data : obj_data;
        break;
        case 'url':
          custom_data = obj.custom_url;
          if(obj.src != "custom" && obj.src != "category")
          {
            try{
              //just in case it has trouble finding it
              og_data = (obj.src == "page") ? boss.service[`${obj.src}_reference_details`][obj.id].url :
              (obj.src == "asset") ? boss.service[`${obj.src}_reference_details`][obj.id].text.link.url :
              og_data;

              if(og_data != undefined && og_data != "")
              {
                og_data = (obj.src == "page") ? ROOTURL + og_data : og_data;
              }

            }catch(err){
              console.log("no getDisplayData",err);
            }//catch
          }//if src
          obj_data = (obj.url == undefined) ? obj_data : (obj.src == "page") ? ROOTURL + obj.url : obj.url;

          display_data = (custom_data != undefined && custom_data != "") ? custom_data :
          (og_data != undefined && og_data != "") ? og_data : obj_data;
        break;

        case 'anchor':

            try{
              //just in case it has trouble finding it
              obj_data = (obj.src == "asset") ? boss.service[`${obj.src}_reference_details`][obj.id].text.link.anchor :
              obj_data;

            }catch(err){
              console.log("no getDisplayData",err);
            }//catch

          display_data =  obj_data;
        break;

        case 'image':
          custom_data = obj.custom_img;
          if(obj.src != "custom" && obj.src != "category")
          {
            try{
              //just in case it has trouble finding it
              og_data = (obj.src == "page") ? boss.service[`${obj.src}_reference_details`][obj.id].img :
              (obj.src == "asset") ? boss.service[`${obj.src}_reference_details`][obj.id].text.link.img :
              og_data;

              if(og_data != undefined && og_data != "")
              {
                og_data = (obj.src == "page") ? ROOTURL + og_data : og_data;
              }

            }catch(err){
              console.log("no getDisplayData",err);
            }//catch
          }//if src
          obj_data = (obj.img == undefined) ? obj_data : (obj.src == "page") ? ROOTURL + obj.img : obj.img;

          display_data = (custom_data != undefined && custom_data != "") ? custom_data :
          (og_data != undefined && og_data != "") ? og_data : obj_data;
        break;

        case "img_obj":

          if(obj.src != "custom")
          {
            let data_src = (obj.src == "category") ? obj.resource_src : obj.src;
            let data_id = (obj.src == "category") ? obj.resource_id : obj.id;

            if(boss.service[`${data_src}_reference_details`][data_id] != undefined){

              try{
                //just in case it has trouble finding it
                if(Array.isArray(boss.service[`${data_src}_reference_details`][data_id].img_obj))
                {
                  og_data = (data_src == "page" || data_src == "asset") ?
                  boss.service[`${data_src}_reference_details`][data_id].img_obj[ndx] :
                  og_data;
                }else {
                  og_data = (data_src == "page" || data_src == "asset") ?
                  boss.service[`${data_src}_reference_details`][data_id].img_obj :
                  og_data;
                }//else

              }catch(err){
                console.log("no getDisplayData",err);
              }//catch

            }//if undefined
          }//if src

          if(Array.isArray(obj.img_obj))
          {
            //i think i had the logic here wrong i had == undefined && == ""
            obj_data = (obj.img_obj[ndx] != undefined && obj.img_obj[ndx] != "") ? obj.img_obj[ndx] : obj_data;
          }else {

            obj_data = (obj.img_obj != undefined && obj.img_obj != "") ? obj.img_obj : obj_data;
          }

          display_data = (og_data != undefined && og_data != "") ? og_data : obj_data;

        break;

      }//switch
      return display_data;
    }//getDisplayData

    this.getMyColors = function()
    {
      let color_location = boss._.tool.views[boss.view];
      let color_array = ['main','content','image','title','body','list','list2'];
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
            let is_in_array = ShowData.valueChecker({"array":all_colors,"string":color_case[item],"mod":"index","type":"sna"});

            if(is_in_array[0] == -1)
            {
              //add the new swatch color to the array
              all_colors.push(color_case[item]);
            }//if
          }//if
        });//color_case_array.forEach

      });//color_array.forEach

      return all_colors;

    }//getMyColors

    this.setSelect = function(data,params)
    {

      boss;
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

    this.setTemplateStyle = function()
    {
      boss._.activate_template(boss._.tool);
    }//setTemplateStyle

    this.getTextStyle = function(data,src)
    {

      if(data.font == 'NaN')
      {
        //console.log("data.font = ",data.font + src);
      }
      let prep_font = (data.font != undefined && data.font != "") ? data.font : "Arial, Helvetica, sans-serif";
      //console.log("prep_font = ",prep_font);
      //console.log("prep_font is a ",typeof prep_font);
      let single_font = (prep_font.indexOf(",") != -1 || prep_font.split(",").length < 2) ? true : false;
      prep_font = (single_font == true) ? `font-family:${prep_font},Arial, sans-serif;` :`font-family:${prep_font};`;
      let align_src = (src == "title" || src == "button") ? true : false;
      let justify = (data.justify != undefined && align_src == true) ? ` justify-content:${data.justify}; ` : "";

      let font = prep_font;
      let height = "";
      let outer_calc = "";
      let font_size = (data.font_size != undefined && data.font_size != "") ? `font-size:${data.font_size}${data.font_measure};` : "";
      let font_color = (data.font_color != undefined && data.font_color != "") ? `color:${data.font_color};` : "";

      //sets up text ellipsis
      //let line_height = (data.line_height != undefined && data.line_height != "") ? `line-height:${data.line_height}${data.font_measure};` : "";
      let line_height = (data.line_height != undefined && data.line_height != "") ? `line-height:${data.line_height}${data.font_measure};` : "";
        let fSz = (data.font_size != undefined && data.font_size != "") ? data.font_size : "none";
        let iHt = (data.item_height != undefined && data.item_height != "") ? data.item_height : "none";
        let lNbr = (data.line_number != undefined && data.line_number != "") ? data.line_number : "none";
        let fMeas = (data.font_measure != undefined && data.font_measure != "") ? data.font_measure : "none";

        let h_Calc = (iHt !== "none" && lNbr !== "none"  && fMeas !== "none") ? iHt * lNbr : "none";
        let proper_src = (src == "body" || src == "title"  || src == "list" || src == "list2" || src == "button" ||
         src == "logo"  || src == "logo2") ? true : false;
        //control read more height
        let has_list = (src == "list-outer" && data.active != undefined && data.active == true && h_Calc !== "none") ? true : false;

        // let has_height_ctrl = (data.height_control != undefined) ? "yes" : "no";
        //i want to change some height controls to form_item_style
        // //if it doesn't have it ignore it/use it. if it does have it, do what it says
        // let use_h_ctrl = (has_height_ctrl == "no") ? true : (has_height_ctrl == "yes" && data.height_control) ? data.height_control;

        height = (/*use_h_ctrl == true && */proper_src === true && data.ellipsis === true && h_Calc !== "none") ? `height:${h_Calc}${data.font_measure};` : "";
         if(src == "list-outer")
         {
           outer_calc = (data.outer_calc != undefined && data.outer_calc != "") ? data.outer_calc : "";
           height = (has_list == true) ? `height:${(h_Calc + outer_calc).toFixed(2)}${data.font_measure};` : "";
         }//if

        let line_number = (data.ellipsis != undefined && data.ellipsis === true && data.line_number != undefined
          && data.line_number != "") ? `-webkit-line-clamp: ${data.line_number};` : "";


        let txt_style = (src == "list-outer") ? height : font + font_size + font_color + line_height + line_number + height + justify;

        if(src == "logo2"){
          //console.log("src == list-outer");
        }
        return txt_style;

    }//getTextStyle


      this.is_responsive = function(str)
      {
        //console.log("is_responsive str = ",str);
        switch(str)
        {
          case "yes":
            ShowData.tool.views[boss.view].responsive = "1";
          break;
          case "no":
            ShowData.tool.views[boss.view].responsive = "0";
          break;
        }//switch
      }//end is_responsive

      this.btn_hover = function(str,cStr,mID)
      {
        let btn_txt = (cStr == "left") ? "sTMSS_L_Btn" : "sTMSS_R_Btn";
        let icon_txt = (cStr == "left") ? "sTMSS_L_Icon" : "sTMSS_R_Icon";
        let btn_string = "." + btn_txt + mID;
        let icon_string = "." + icon_txt + mID;
        let targ_btn = document.querySelector(btn_string);
        let targ_icon = document.querySelector(icon_string);

        switch(str)
        {
          case "enter":
          let mk_btn_col = ShowData.tool.views[boss.view].btn_hov + boss._.tool.views[boss.view].btn_base16;
            targ_btn.style.backgroundColor = mk_btn_col;
            targ_icon.style.color = ShowData.tool.views[boss.view].icon_hov;

          break;

          case "leave":
            targ_btn.style.backgroundColor = ShowData.tool.views[boss.view].btn_hex;
            targ_icon.style.color = ShowData.tool.views[boss.view].icon_bg;
          break;
        }//switch
      }//btn_hover

      this.form_reset = function(fNm)
      {
        ShowData.toolData.forEach(function(entry)
        {
          if(entry.file_name == fNm)
          {
            ShowData.tool = ShowData.bboy(entry);
          }
        });
      }//form_reset


      //this has to run once everything is finished loading so i put it in $onInit
      //this.showDivs(slideIndex);

      /******  custom section *******/

      this.get_device_size = function()
      {
        //let screen_width = document.body.clientWidth;
        let screen_width = window.innerWidth;

        //seems off by 16
        let sm = 480;//464;
        let md = 768;//752
        let device_size = (screen_width < sm) ? "small" :
        (screen_width >= sm && screen_width < md) ? "medium" :
        "large";
        boss.device_size = device_size;
        return device_size;
      }//get_device_size

      this.update_view = function(fc)
      {
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

            let size_ary = {small:"mobile",medium:"tablet",large:"desktop",xlarge:"max"}
            let device_size = boss.get_device_size();
            //if its active change the view
            view_str = size_ary[device_size];

          }//else

            let active_view = (boss.exists(boss._.tool.views[view_str])  &&
            boss.exists(boss._.tool.views[view_str].active_view)) ? true : false;

            if(boss.view != view_str && active_view == true)
            {
              boss._.refresh_tool = "true";
            }//if

            // if theres an active view switch to the view
            if(boss.mode == "admin" || active_view )
            {
              boss.view = view_str;
              boss._.view = boss.view;
            }else{
              //otherwise use default
              boss.view = "default";
              boss._.view = boss.view;
            }
          resolve();
        });//promise

      }//update_view

      this.dropdown_view = function()
      {
        //target the dropdown menu
        let targ_sel_str = boss.view_select;
        let select_el = document.querySelector(`.${targ_sel_str}`);
        var accessIndex = boss._.getSelectedValue(`.${targ_sel_str}`,"value_index","default");
        //select_el.selectedIndex = accessIndex;

      }///dropdown_view

      this.select_image_ndx = function(iObj)
      {
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

      this.custom_delay = function()
      {
        //boss.watch_nbr ++;
        boss.soft_apply(boss.prep_custom);
        return `fin`;
      }//custom_delay

      this.empty_loader = function(lst)
      {
        let mt = boss._.tool.module_title;
        console.log("module title = ",mt);

        let has_assets = (lst == true) ? true : (boss.my_stars == undefined || boss.my_stars === "" ||
        Array.isArray(boss.my_stars) && boss.my_stars.length < 1) ? false : true;

        //bugfix: this line prevented repeatDone data from processing properly
        if(boss.initiated != true || has_assets == true)return;
        //if this module has no assets

        //run customizations
        //boss.custom_delay();

        boss.prep_custom();

        //if its invisible run outer style
        if(boss._.tool.views[boss.view].invisible == true)
        {
          //boss.process_size();
          boss.outer_style();
        }
        return;
      }//empty_loader

      this.repeat_done = function(lst)
      {
        if(lst != true)return;

        //run customizations
        //boss.custom_delay();

        boss.prep_custom();

        //if its invisible run outer style
        if(boss._.tool.views[boss.view].invisible == true)
        {
          //boss.process_size();
          boss.outer_style();
        }
        return;
      }//repeat_done empty_loader2

      this.prep_custom = function(chk)
      {
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

      this.getAnchor = function(t_Obj,str)
      {
        let targ_obj = t_Obj;
        let active_anchor = targ_obj.active_anchor || false;
        let has_alias = (targ_obj.anchor_alias != undefined && targ_obj.anchor_alias != "") ? true : false;

        return (active_anchor && has_alias) ? targ_obj.anchor_alias : `${str}_${boss.iUN}`;
      }

      this.has_destination = function()
      {
        return (boss.destination == undefined || boss.destination == "") ? false : true;
      }//has_destination

      this.custom_keys = {"":""};
      this.view_keys = {"":""};
      this.custom_ary_obj = {label:"",options:boss.custom_keys};
      this.view_ary_obj = {label:"default",options:boss.view_keys};

      this.proper_views = [
        "default","mobile","tablet","desktop","max"
      ];

      this.current_views = {
        "default":"default"
      }

      this.prop_prop_obj = {label:"",options:boss.proper_properties};

      this.nest_properties = [
        "title","body"
      ];
      this.nest_prop_obj = {label:"",options:boss.nest_properties};

      this.el_pfx = "imageMenu";

      this.child_elements = [
        "div","h1","h2","h3","h4","h5","h6","h7",
        "li","ol","p","span","ul"
      ];
      this.child_els_obj = {label:"",options:boss.child_elements};
      this.section_objects = {
        title:`.${boss.el_pfx}_head_html_${boss.iUN}`,
        body:`.${boss.el_pfx}_body_html_${boss.iUN}`
      };

      this.get_view = function()
      {
        return "default";
      }//get_view

      this.top_element = function(tObj,val)
      {
        //determines if image or title is on top
        let target_obj = tObj;
        let value = val;

        //if exists compare, if not exists compare value - image is default
        let is_on_top = (boss._.exists(target_obj.top_element) && target_obj.top_element == val) ? true :
        (boss._.exists(target_obj.top_element) && target_obj.top_element != val) ? false :
        (value == "image") ? true : false;

        // console.log(`is_on_top = ${is_on_top}`)
        return is_on_top;

      }//top_element

      this.get_select_props = function(mod)
      {
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
              let is_in_array = ShowData.valueChecker({"array":sample_array,"string":entry,"mod":"index","type":"sna"});

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

      boss.get_select_props("custom");
      boss.get_select_props("view");

      this.make_select = function(str,mod)
      {
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
              // boss.soft_apply(boss.remote_loader,"hide")
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
        let current_select = cs,
        mod = md || "default",
        targ_sel_str = (mod == "custom") ? boss.custom_select: boss.view_select,
        select_el = document.querySelector(`.${targ_sel_str}`),
        accessIndex = boss.service.getSelectedValue(`.${targ_sel_str}`,"value_index",current_select);

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
        return (boss.destination.match(/custom\d+/g)) ? true : false;
      }//is_custom

      this.not_custom = function()
      {
        let sample_array = boss.proper_properties;
        let is_in_array = ShowData.valueChecker({"array":sample_array,"string":boss.destination,"mod":"index","type":"sna"});

        return (boss.destination == "" || is_in_array[0] == -1) ? true : false;
      }//not_custom

      this.process_custom_element = function(t_obj,typ,nM,dest)
      {
        //return new Promise(function(resolve, reject) {

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

      this.declare_last = function(lst){
        let targ_str = boss.section_objects['body'];

        //call the parent target
        let collection = document.querySelectorAll(targ_str);
        let meseeks = "last here";

      }//declare_last

      $scope.$on('repeatDone', function(event,data)
      {

        if(data.toolname != "blogMod" || data.iun != boss.iUN )return;
          console.log('good to go');

          let meseeks = "repeat done";
          boss.repeat_done(data.last);
      });

      this.delay_nested = function(nest)
      {
        //split the string
        //if(name == ""){return "";}
        let t_obj = nest.t_obj;
        let type = nest.type;
        let dest = nest.dest;


        let name_arry = name.split(" ");
        let section_target = t_obj.nested_parent || "";//name_arry[0];
        let element_target = t_obj.nested_element || ""//name_arry[1];


        //test against a list of options
        /*
        let in_nest_array = ShowData.valueChecker({"array":boss.nest_properties,
        "string":section_target,"mod":"index","type":"sna","action":"match"});
        let in_child_array = ShowData.valueChecker({"array":boss.child_elements,
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
              targ_el = collection[i].getElementsByTagName(element_target);
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
        let chk_str = targ_el.className;
        let new_class = boss.weedOut(chk_str,boss.outer_array);
        let target_detail = boss._.tool.views[boss.view][dest];//(dest.match(/custom\d+/g)) ? :
        let active_style = (target_detail[`active_${dest}`] != undefined) ? target_detail[`active_${dest}`] :
        (target_detail.active_style != undefined) ? target_detail.active_style :  false;

        targ_el.className = ShowData.removeSomething(new_class,' ');


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
        targ_el.style = ShowData.removeSomething(new_style,' ');
        targ_el.dataset.view = boss.view;
        let mesee = new_style;

      }//customize

      this.getHeight = function(dest)
      {
        //return `min-height:${ShowData.tool.views[boss.view].height}px;`;
        let measure = (boss._.tool.views[boss.view][dest].measure != undefined && boss._.tool.views[boss.view][dest].measure != "") ?
        boss._.tool.views[boss.view][dest].measure : "";
        let height = (boss._.tool.views[boss.view][dest].height != undefined && boss._.tool.views[boss.view][dest].height != "" ) ?
        boss._.tool.views[boss.view][dest].height : "";
        return (measure != "" && height != "") ? `height:${boss._.tool.views[boss.view][dest].height}${measure};` : "";
      }//getHeight

      this.rivals = function(dest,active,adjust)
      {//deprecated - use link_vars

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
              });
            }

        }//switch

        let mesee  = boss._.tool.views;
      }//remove_view


      /******  end custom section *******/


      this.refresh = function()
      {
        $scope.$digest();

      }//refresh

      this.me_seeks= function(data)
      {
        if(boss._.tool.file_name != "image_menu")return;
        boss;
        if(data != undefined)
        {
          //console.log("here comes data",data);
        }
        let tVar = data || "";
          //console.log("im working",tVar);
        return true;

      }//me_seeks

      this.meView = function(data,params)
      {
        if(boss._.tool.file_name != "image_menu")return;
        boss;
        if(data != undefined)
        {
          //console.log("here comes data",data);
          //boss.tool.views[boss.view].title.font = data;
          //console.log("here comes more ",boss.tool.views[boss.view].title);
        }
        let tVar = data || "";
          //console.log("im working",tVar);
        return true;

      }//meView

      this.hnic = function()
      {
        return (boss._.tool.file_name == boss.file_name) ? true : false;
      }//hnic


      this.refresh = function()
      {
        $timeout(function(){},0,true);

      }//refresh

      this.template_styles = {};
      this.template_styles.options = mM_temps;
      this.template_styles.label = "single basic";

      this.tool_properties = [];

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
        let custom_keys = [];
        let obj_keys = Object.keys(boss._.tool.views[boss.view]);
        let sample_array = boss.proper_properties;
        boss.tool_properties = [];

        obj_keys.forEach(function(entry)
        {
            ///custom[0-9]/g - works but only matches 1 digit
            //filter for approved/proper properties or 'custom' pfx
            let is_in_array = ShowData.valueChecker({"array":sample_array,"string":entry,"mod":"index","type":"sna"});

            if(is_in_array[0] != -1 /* || entry.match(/custom\d+/g)*/)
            {
              //i don't want any custom properties in here
              custom_keys.push(entry);
              //run a restructure on active_X
              let active_str = `active_${entry}`;
              if(boss._.exists(boss._.tool.views[boss.view][entry][active_str]))
              {
                //boss._.restructure(boss._.tool.views[boss.view][entry],active_str,'active');
              }//if
            }
        });

        boss.tool_properties = custom_keys;

        let mesee = custom_keys;
        boss.soft_apply();

      }//make_tool_properties

      boss.make_tool_properties();



    }],
    controllerAs:"take1",
    bindToController:true
  };
}]);

  //first the value for the json file / then the human readable value for the select options
  //"image_menu":"mega menu" //produced an error. doesn't like underscores
  var mM_temps = {
    "basic":"single basic",
    "mega":"mega menu"
  }

})();
