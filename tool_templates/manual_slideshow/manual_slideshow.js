(function(){
  console.log("manualSlideshow running!");

  var app = angular.module("pictureShow");
  app.directive("manualSlideshow",["$window",function($window){
  return{
    restrict:"C",
    templateUrl:function(elem, attr){
      let file_name = attr.marquee;
      let template_style = (attr.motiv == "settings") ? "admin" : attr.motiv;
      //let urlStr = `${BASEURL}components/com_psmod/xfiles/js/${file_name}.html`;

      let urlStr = `${attr.home}tool_templates/${file_name}/templates/${template_style}.html`;

      //console.log(`new url string = ${urlStr}`);

      return urlStr;
    },
    /*link: function(scope, element, attrs, ngModel) {
            if (
                   'undefined' !== typeof attrs.type
                && 'number' === attrs.type
                && ngModel
            ) {
                ngModel.$formatters.push(function(modelValue) {
                    return Number(modelValue);
                });

                ngModel.$parsers.push(function(viewValue) {
                    return Number(viewValue);
                });
            }
            if(element.className.indexOf("mSS_stgs_bg_option") != -1)
            {
              //console.log("btn element detected");
            }//end if
        },*/
    /*template:'<div class="showTime_manual_slideshow w3-content w3-display-container pure-h" ng-if="take1.motiv == \'default\'">'
      + '<div class="showTime_img_cont pure-h" >'
        + '<div id="showTime_img_{{take1.iUN}}_{{action.id}}"'
        + 'ng-repeat="action in take1.my_stars" ng-if="take1.initiated"'
        + 'class="showTime_img pure-h  mySlides" ng-bind="take1.insertCanvas(action)">'
        + '</div>'
      + '</div>'
      + '<button class="w3-button w3-black w3-display-left" ng-click="take1.plusDivs(-1)">&#10094;</button>'
      + '<button class="w3-button w3-black w3-display-right" ng-click="take1.plusDivs(1)">&#10095;</button>'
    + '</div>'
    //+ '<div ng-if="take1.motiv == \'settings\'">switched to settings \n data params = {{take1.service.current_tool.params.data}}'
    + '<div class="mSS_stgs" ng-if="take1.motiv == \'settings\'">'
    + '<h5 class="mSS_stgs_label">manual slideshow settings</h5>'
    + '<div class="mSS_stgs_current_info mSS_stgs_content_box">'
      + '<label title="size of your current viewport (above the fold)">current screen size:</label>'
      + '<div>height:   {{take1.screen_width}}</div>'
      + '<div>width:   {{take1.screen_height}}</div>'
    + '</div><!--ends current info-->'
    + '<div class="mSS_stgs_custom_info mSS_stgs_content_box">'
      + '<label title="customize the size your slideshow should be compared to the viewport">custom size:</label>'
      + '<div class="mSS_stgs_size_wrapr"><div class="mSS_stgs_size_wrapr">width:</div><input class="mSS_stgs_custom_input" type="text" ng-model="take1.service.tool.views[boss.view].width"></div>'
      + '<div class="mSS_stgs_size_wrapr"><div >height:</div><input class="mSS_stgs_custom_input" type="text" ng-model="take1.service.tool.views[boss.view].height"></div>'
    + '</div><!--ends current info-->'
    + '<div class="mSS_stgs_mobility_info mSS_stgs_content_box">'
      + '<label title="should the slideshow be responsive">mobile friendly:</label>'
      + '<button type="button" class="mSS_stgs_resp first w3-btn" ng-click="take1.is_responsive(\'yes\')" '
      + 'ng-class="{active:take1.responsive == '1'}">yes</button>'
      + '<button type="button" class="mSS_stgs_resp w3-btn" ng-click="take1.is_responsive(\'no\')" '
      + 'ng-class="{active:take1.responsive == '0'}"  title="if set to \'no\' the slideshow will only be visible on desktops" >no</button>'
    + '</div><!--ends current info-->'
    + '</div>',*/
    /*
    + '<div>'
    + '</div>'
    */
    scope: {
      marquee: '@',
      cast: '@',
      home: '@',
      motiv: '@',
      sttngs: '=',
      mode: '@',
      stage: '@'
    },
    link: function(scope, element, attrs){

      if(attrs.mode == "admin")
      {
        ///the section updates the available screen_width and height on resize - useful for admin settings
        angular.element($window).bind('resize', function(){
          //bugfix - the element passed here doesn't always have a controller but the scope seems constant
          let my_scope = scope;
          //let el_ctrlr = element.controller();//bug: doesn't always have a controller
          let el_ctrlr = scope.take1;//fixed
          el_ctrlr.service.screen_width = document.body.clientWidth;
          //el_ctrlr.service.screen_width = document.querySelector(el_ctrlr.front_stage).parentNode.clientWidth;
          //console.log("clientWidth = ",document.body.clientWidth);
          el_ctrlr.service.screen_height = document.body.clientHeight;
          //el_ctrlr.service.screen_height = document.querySelector(el_ctrlr.front_stage).parentNode.clientHeight;
          //console.log("clientHeight = ",document.body.clientHeight);
          el_ctrlr.refresh();
        });

      }else {
        angular.element($window).bind('resize', function(){
          let my_scope = scope;
          //let el_ctrlr = element.controller();//bug: doesn't always have a controller
          let el_ctrlr = scope.take1;//fixed
          //el_ctrlr.service.resize_id ++;
          //el_ctrlr.slick_refresh();
          // el_ctrlr._.refresh_tool = "true";
          var phase = scope.$root.$$phase;
          if(phase == '$apply' || phase == '$digest') {
              el_ctrlr.update_view();
          } else {
            scope.$apply(el_ctrlr.update_view());
          }//else

          let me_seeks = el_ctrlr.view;
          el_ctrlr.soft_apply()
          .then(function(){
            //fixes the slick slider refresh delay - formerly passed as a callout to soft_apply
            el_ctrlr.slick_refresh();
          });
        });
      }


    },
    controller:["ShowData","$sce","$scope","$timeout",function(ShowData,$sce,$scope,$timeout){

      var boss = this;
      this.service = ShowData;
      this._ = ShowData;
      if(boss.service.tool.file_name != "manual_slideshow")return;

      var iUN = Math.round(Math.random() * 10000);
      this.iUN = iUN;

      this.file_name = boss.marquee;
      this.object_params = [];
      this.object_elements = {};
      this.initiated = false;//helps to delay calling elements b4 template is ready
      this.screen_width = ShowData.screen_width;
      this.screen_height = ShowData.screen_height;
      this.responsive = '1';
      this.background = "";
      this.view = "default";
      this.add_view = false;
      this.view_select = `showTime_view_select_${boss.iUN}`;
      this.section = "basic";
      this.option_section = "options";
      this.front_stage = "";
      var slideIndex = 1;
      this.destination = "";
      this.add_custom = false;
      this.service.resize_id = 0;
      this.custom_select = `showTime_custom_select_${boss.iUN}`;
      this.loader = 0;
      this.loader_el = "showTime_curtain";
      this.device_size = "";

      this.info_space = {
        height_style:0,
		    limit_devices:0,
        design_mode:0,
        custom_element:0
      }

      this.proper_properties = [
        "outer","main",
        "content","imagelayer",
        "imagebox",/*"image",*/
        "textlayer","textbox",
        "title","body",
        "link","button"
      ];

      //console.log("stars = ",this.stars);

      $scope.$watch(function(){return boss.marquee}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
          if(boss.service.tool.file_name != "manual_slideshow")return;
          boss.file_name = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss.view}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
          if(boss.service.tool.file_name != "manual_slideshow")return;
          boss.service.current_view = newValue;
          boss.make_tool_properties();
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.view}, function (newValue, oldValue, scope) {
        if (newValue)

        if(boss.service.tool.file_name != "manual_slideshow")return;

        boss.view = newValue;
        boss._.view = boss.view;
        ShowData.refresh_tool = "true";

        boss.soft_apply();
      }, true);

      //watch for changes in assets
      $scope.$watch(function(){return boss.service.asset_info}, function (newValue, oldValue, scope) {
        //Do anything with $scope.letters
        //console.log("newValue = ",newValue);
        //console.log("oldValue = ",oldValue);
        if (newValue && boss.initiated == true)
          //boss.my_stars = newValue;
        boss.my_stars = newValue;//i think this is an array of all the asset content associated with this tool
        //console.log("i see a change in my_stars = ",boss.my_stars);

      }, true);

      $scope.$watch(function(){return boss.service.screen_width}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        boss.screen_width = newValue;
        if(boss.initiated == true)
        {
          if(boss.service.tool.file_name != "manual_slideshow")return;
          boss.process_size();
        }//end if
        //console.log("i see a change in screen_width = ",boss.screen_width);
      }, true);
      $scope.$watch(function(){return boss.service.screen_height}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        boss.screen_height = newValue;
        if(boss.initiated == true)
        {
          if(boss.service.tool.file_name != "manual_slideshow")return;
          boss.process_size();
        }//end if
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss.service.preview_display}, function (newValue, oldValue, scope) {
        if (newValue){

          if(boss.initiated == true)
          {
            if(boss.service.tool.file_name != "manual_slideshow")return;
            boss.process_size();
          }//end if
        }
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);


      $scope.$watch(function(){
        return boss.service.tool.views[boss.view].custom_class
      }, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        boss.cast = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss.service.tool.views[boss.view].width_pct}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        //boss.cast = newValue;
        if(boss.service.tool.file_name != "manual_slideshow")return;
        boss.process_size();
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss.service.tool.views[boss.view].auto_width}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        //boss.cast = newValue;
        if(boss.service.tool.file_name != "manual_slideshow")return;
        boss.process_size();
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      //do i need this $watch?
      $scope.$watch(function(){return boss.service.tool.views[boss.view].sample_class}, function (newValue, oldValue, scope) {
        if (newValue){
          //boss.my_stars = newValue;
        //boss.alternate = newValue;
        }
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      //watch for ShowData.tool changes
      $scope.$watch(function(){return boss.service.tool}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        boss.tool = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
        if(boss.service.tool.file_name != "manual_slideshow")return;
          boss.process_size();

      }, true);

      $scope.$watch(function(){return boss.service.tool.views[boss.view]}, function (newValue, oldValue, scope) {
        if (newValue){
          if(boss.service.tool.file_name != "manual_slideshow")return;
          let mesee = newValue;
          //boss.my_stars = newValue;
        //boss.alternate = newValue;
        }
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);


      //console.log("select array = ",this.selectArray)
      this.$onInit = async function() {
        //boss.my_stars = boss.stars;
        //console.log(this);

        let mt = boss._.tool.module_title;
        console.log("module title = ",mt);

        boss.service.current_view = boss.get_view_size();

        if(boss._.tool.notes == undefined)
        {
          boss._.tool.notes = "";
        }//if

        boss.update_view()
        .catch(function(err){
          //console.log('not on my watch')
        });;

        await boss.make_tool_properties();

        boss.service.screen_width = document.body.clientWidth;
        boss.service.screen_height = document.body.clientHeight;
        //let venue = document.querySelector(boss.front_stage).parentNode;
        //boss.service.screen_width = venue.clientWidth;
        //boss.service.screen_height = venue.clientHeight;//probably won't have dimensions till i fill it?

        if(boss.mode == "site" && boss.motiv != "settings"){
          await boss.getAssets();
        }//if

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
           //if(boss.my_stars.length == 0){  boss.outer_style();}
        },0,true).then(function(){
           //boss.showDivs(slideIndex);
           //late watch
           slideIndex = 1;
           $scope.$watch(function(){return boss.service.tool.views[boss.view].width}, function (newValue, oldValue, scope) {
             if (newValue)
               //boss.my_stars = newValue;
               if(newValue == "default"){
                 ShowData.tool.views[boss.view].width = document.body.clientWidth * .95;
                 //ShowData.tool.views[boss.view].width = document.querySelector(boss.front_stage).parentNode.clientWidth * .95;
                 //if(boss.my_stars.length == 0 && boss.initiated == true){boss.outer_style();}
               }
             //console.log("i see a change in screen_height = ",boss.screen_height);
           }, true);

           $scope.$watch(function(){return boss.service.tool.views[boss.view].height}, function (newValue, oldValue, scope) {
             if (newValue)
               //boss.my_stars = newValue;
               if(newValue == "default"){
                 let c_Ht = document.body.clientWidth * .95;
                 //let c_Ht = document.querySelector(boss.front_stage).parentNode.clientWidth * .95;
                 //why 2.666? i guess im going to automatically make the default a banner style
                 ShowData.tool.views[boss.view].height = Math.ceil(c_Ht/2.66666);
               }
             //console.log("i see a change in screen_height = ",boss.screen_height);
           }, true);

           $scope.$watch(function(){return boss.service.tool.views[boss.view].responsive}, function (newValue, oldValue, scope) {
             if (newValue)
               //boss.my_stars = newValue;
             boss.responsive = newValue;
             //console.log("i see a change in responsive = ",boss.responsive);
             $timeout(function(){
               //console.log("responsive timeout running!");
               if(boss.initiated == true)
               {
                 if(boss.service.tool.file_name != "manual_slideshow")return;
                 boss.process_size();
               }//end if
             },0,true);
           }, true);

           //window.dispatchEvent(new Event('resize'));
        });//end .then() of $timeout

        return;

      };//end onInit


      this.getAssets = async function()
      {
        //i need getAssets to run later
        let trans = {};
        trans.task = "getAssets";
        //trans.data = ShowData.data_ids.join();
        let convert_array = [];
        if(typeof ShowData.data_ids != "string")
        {
          //hack for .data_ids.join  is not a function
          //https://stackoverflow.com/questions/1424710/why-is-my-join-on-a-javascript-array-failing
          for(let i = 0; i < ShowData.data_ids.length; i++){
            convert_array.push(ShowData.data_ids[i]);
          }
          trans.data = convert_array.join();
        }else {
          trans.data = ShowData.data_ids;
        }

        if(trans.data == "") return;

        await boss.service.request(trans)
        .then(function(results)
        {
          //console.log("places results = ",results);
          if(results != "error"){

            ShowData.asset_info = results;

            //console.log("tool_data = ",ShowData.asset_info);
          }
          //$scope.$apply();
        }).catch(function(err)
        {
          console.log(`psmod_app getData error ${err}`);
        });

        //console.log("getAssets finished running!");

        return;
      }//getAssets


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
        scrap = boss.weedOut(chk_str,['flexMode'],queryStr);

        //if(is_responsive != '1')return;
        let add_class = (boss.mode == "admin" && boss._.preview_display != "max") ? ShowData.tool.views[boss.view].sample_class: ShowData.tool.views[boss.view].custom_class;
        add_ary = add_class.split(" ");
        boss_cont.className = boss._.clear_redundacy(boss_cont.className,add_ary);
        let use_class = add_class;// speghetti code ment to erase redundancies in custom_class
        //limit/hide on devices

        //hack
        //fixes multiple flexMode entries in outer className
        use_class = (is_responsive == '2') ? use_class +  " flexMode " : use_class;

        //limit/hide on devices
        let hide_small = (boss.service.tool.views[boss.view].hide_small == true) ? " d3_hide_small " : "";
        let hide_medium = (boss.service.tool.views[boss.view].hide_medium == true) ? " d3_hide_medium " : "";
        let hide_large = (boss.service.tool.views[boss.view].hide_large == true) ? " d3_hide_large " : "";

        //restrict action to site/client side display
        let device_limits = (boss.mode != "admin" && boss.service.tool.views[boss.view].limit_devices == true) ? ` ${hide_small} ${hide_medium} ${hide_large} ` : "";

        let invisible = (boss.mode != "admin" && boss.service.tool.views[boss.view].invisible == true) ? " invisible " : "";

        let adv_class = boss._.tool.views[boss.view].outer.advanced_class;
        boss_cont.className = boss._.clear_redundacy(boss_cont.className,adv_class);

        let newClass = ` ${boss_cont.className} ${use_class} ${device_limits} ${invisible} ${adv_class}`;

        boss_cont.className = ShowData.removeSomething(newClass,' ');
        boss_cont.dataset.option_x = "outer";

        let parent_module = boss._.true_target(boss_cont,"moduletable","className");
        if(boss._.exists(boss._.tool.views[boss.view].grid_area_class) && boss.mode == "site"){
          //get the parent moduletable - make it inline ad add width
          let grid_area_class = boss._.tool.views[boss.view].grid_area_class || "";
          parent_module.className = boss._.clear_redundacy(parent_module.className,[grid_area_class]);
          parent_module.className = `${parent_module.className} ${grid_area_class}`;
          parent_module.className = ShowData.removeSomething(parent_module.className,' ');
        }// if grid_area_class

        if(boss._.exists(boss._.tool.views[boss.view].grid_area_style) && boss.mode == "site"){
          let grid_area_style = boss._.tool.views[boss.view].grid_area_style || "";
          parent_module.style = `${grid_area_style}`;
          // let par_style = parent_module.style || "";
          // parent_module.style = boss._.clear_redundacy(par_style,[grid_area_style]);
          // parent_module.style = ShowData.removeSomething(parent_module.style,' ');
        }// if grid_area_style

      }//outer_style


      this.getClass_OG = function()
      {
        let use_class = (boss.mode == "admin") ? ShowData.tool.views[boss.view].sample_class: ShowData.tool.views[boss.view].custom_class;
        use_class = `${use_class} ${boss.service.tool.views[boss.view].alt_class}`;
        use_class = ShowData.removeSomething(use_class," ");
        return use_class;
      }//getClass_OG

      /***  blogMod section ***/
      this.getClass = function(str)
      {
        let use_class = "";
        let type = (str.match(/custom\d+/g)) ? "custom" : str;
        let target_detail = ShowData.tool.views[boss.view][str];
        let advanced_class = "";

        switch (type) {
          case "outer":
            advanced_class = (boss.service.exists(target_detail.advanced_class)) ?
        		target_detail.advanced_class : "";

        		use_class = `${use_class} ${advanced_class}`;
            use_class = (boss.mode == "admin") ? `${use_class} ${ShowData.tool.views[boss.view].sample_class}`: `${use_class} ${ShowData.tool.views[boss.view].custom_class}`;

            use_class = ShowData.removeSomething(use_class," ");
          break;

          case "main":
          case "content":
          case "title":
          case "body":

          if(target_detail.device_value)
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

            advanced_class = (boss.service.exists(target_detail.advanced_class)) ?
            target_detail.advanced_class : "";

            use_class = `${use_class} ${advanced_class}`;

            use_class = `${use_class} ${ShowData.tool.views[boss.view][str].custom_class} `;
            use_class = (ShowData.tool.views[boss.view][str].ellipsis === true) ? `${use_class} clamp ` : use_class;
            use_class = (str == 'content' && ShowData.tool.views[boss.view][str].card_styling != false) ? `${use_class} w3-card ` : use_class;
            use_class = ShowData.removeSomething(use_class," ");
          break;

          case "link":
            //use_class = (ShowData.tool.views[boss.view].link.shadow_mode === true) ? ` ${ShowData.tool.views[boss.view].link.shadow} ` : "";
            advanced_class = (boss.service.exists(target_detail.advanced_class)) ?
            target_detail.advanced_class : "";

            use_class = `${use_class} ${advanced_class}`;
            use_class = (ShowData.tool.views[boss.view].link.active_width === true) ? `${use_class} d3_pmw${ShowData.tool.views[boss.view].link.width_pct} ` : use_class;
            use_class += ` ${ShowData.tool.views[boss.view].link.custom_class} `;

            use_class = (ShowData.tool.views[boss.view][str].card_styling != false) ? `${use_class} w3-card ` : use_class;
            use_class = ShowData.removeSomething(use_class," ");
          break;

          default:
            advanced_class = (boss.service.exists(target_detail.advanced_class)) ?
            target_detail.advanced_class : "";

            use_class = `${use_class} ${advanced_class}`;
            use_class = (boss.mode == "admin") ? `${use_class} ${ShowData.tool.views[boss.view].sample_class}`: `${use_class} ${ShowData.tool.views[boss.view].custom_class}`;
            use_class = `${use_class} ${boss.service.tool.views[boss.view].alt_class}`;
            use_class = ShowData.removeSomething(use_class," ");

        }//switch
        return use_class;
      }//getClass

      this.getStyle = function()
      {
        return (ShowData.tool.views[boss.view].height_style == 'strict') ? `height:${ShowData.tool.views[boss.view].height}px;` : "";
      }//getStyle

      this.get_adv_design = function (item,fE,tP) {
        // tP can be style or class
        let target_params = (item != undefined && boss._.exists(item)) ? JSON.parse(item) : "";

        if(target_params == "")return "";

        let focus_el = fE;
        let type = tP;
        let adv_design = "";

        let size_ary = {small:"mobile",medium:"tablet",large:"desktop",xlarge:"max"};
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

      this.getParam = function(data)
      {
        let  targ_data = data;
        let params_str = "params" + targ_data.id;

        if(boss.object_params[params_str] == undefined){
          boss.object_params[params_str] = JSON.parse(targ_data.params);
        }//end if

        let my_params = boss.object_params[params_str];
        //console.log("blog_module params =",my_params);

        return my_params;

      }//getParam


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
        let align_src = (src == "title" || src == "link" || src == "body") ? true : false;
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
          let proper_src = (src == "body" || src == "title"  || src == "list" || src == "button" ||
           src == "logo"  || src == "logo2") ? true : false;
          //control read more height
          let has_list = (src == "list-outer" && data.active_list != undefined && data.active_list == true && h_Calc !== "none") ? true : false;

          height = (proper_src === true && data.ellipsis === true && h_Calc !== "none") ? `height:${h_Calc}${data.font_measure};` : "";
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

      this.setLinkHover = function(eID,dest)
      {
        let targ_str = `.read_more_${boss.iUN}_${eID}`;
        let targ_el = document.querySelector(targ_str);//boss.service.true_target
        if(!targ_el) return;
        targ_el.addEventListener("mouseenter",function(){
          targ_el.style.backgroundColor = `${boss.service.tool.views[boss.view][dest].bg_hov_hex}`;
          targ_el.style.color = `${boss.service.tool.views[boss.view][dest].font_hov_color}`;
        });
        targ_el.addEventListener("mouseleave",function(){
          targ_el.style.backgroundColor = `${boss.service.tool.views[boss.view][dest].bg_hex}`;
          targ_el.style.color = `${boss.service.tool.views[boss.view][dest].font_color}`;
        });
      }//setLinkHover

      this.active_content = function(action)
      {
        let active_title = boss.service.tool.views[boss.view].title.active_title;
        let active_body = boss.service.tool.views[boss.view].body.active_body;
        let active_link = boss.service.tool.views[boss.view].link.active_link;
        let my_param = boss.getParam(action);

        //head check
        if(boss.tool.views[boss.view].title.active_title === true)
        {
          if(boss.tool.views[boss.view].title.custom_text == false)
          {
            active_title = (my_param.text.head.text == undefined ||
            my_param.text.head.text == "") ? false : true;
          }else {
            active_title = (my_param.text.head.html == undefined ||
            my_param.text.head.html == "") ? false : true;
          }
        }else{
          active_title = false;
        }

        //go to the body
        if(boss.tool.views[boss.view].body.active_body === true)
        {
          if(boss.tool.views[boss.view].body.custom_text == false)
          {
            active_body = (my_param.text.body.raw == undefined ||
            my_param.text.body.raw == "") ? false : true;
          }else {
            active_body = (my_param.text.body.html == undefined ||
            my_param.text.body.html == "") ? false : true;
          }
        }else{
          active_body = false;
        }

        if(boss.tool.views[boss.view].link.active_link === true)
        {
          active_link = (my_param.text.link.alias != undefined && my_param.text.link.alias != '' &&
          my_param.text.link.url != undefined && my_param.text.link.url != '') ? true : false;
        }else{
          active_link = false;
        }

        return (active_title || active_body || active_link) ? true : false;
      }//active_content

      /*** end blogMod section ***/

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


      this.insertCanvas = function(dt,lst)
      {
        if(boss.service.tool.file_name != "manual_slideshow")return;

        var inObj = dt;
        let restrict_id = "canvas_img_" + iUN + "_" + inObj.id;
        if(document.querySelector("." + restrict_id) && ShowData.refresh_tool == "false") return;

        let obj_params = JSON.parse(inObj.params);

        let params_str = "params" + inObj.id;
        let last_el = lst;

        // i didn't want to do numbers and create gap indexes so i used a multidim array
        boss.object_params[params_str] = obj_params;
        let obj_str = "canvas_" + iUN + "_"  + inObj.id;
        let asset_id = "showTime_img_" + iUN + "_" + inObj.id;
        let addClass = " " + restrict_id + " arc_rich_img prev_img asset darken ";//d3-w80 d3-h30
        boss.canvas_mkr({name:obj_str,params:obj_params,home:asset_id,class:addClass,orient:true});
        //orient

        //console.log("asset_id = ",asset_id);

        if(ShowData.refresh_tool != "false" && last_el == true){
          //if its the last one reset the container & tell it to close;

          boss.outer_style();

          ShowData.refresh_tool = "close";
        }//end if boss
        //console.log("insert data = ",dt);
      }//insertCanvas

      this.image_object_converter = function(cpar)
    	{
    		let data = cpar;
    		if(data.img_obj[0] == undefined)
    		{
    		  let temp_obj = boss.service.bboy(data.img_obj);
    		  data.img_obj = [];
    		  data.img_obj[0] = (boss.service.exists(temp_obj)) ? temp_obj : {} ;
          data.img_obj[0].url = data.url;

          if(boss.service.exists(data.canvas))
          {
            data.img_obj[0].canvas = boss.service.bboy(data.canvas);
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
        //let img_nbr = 0;//setup to become dynamic
        let img_nbr = boss.select_image_ndx(can_params);//boss.view

        let can_custom_class = cObj.class || "";
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
        can_class += " " + use_class + " ";
        can_class = ShowData.removeSomething(can_class,' ');
        let can_name = cObj.name;//variable name
        let orient = cObj.orient || true;

        if(orient != false){
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
        //boss.object_elements[can_name].clearHome("true");
        //boss.object_elements[can_name].setScale(3);
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

      this.plusDivs = function(n) {
        if(boss.initiated == false)return;
        boss.showDivs(slideIndex += n);
      }

      this.showDivs = function(n) {
        var i;
        //let cls_str = "mySlides" + iUN;
        //let cls_str = "mySlides";
        let cls_str = "mySlides" + boss.service.module_id;//bugfix for multiple slideshows
        var x = document.getElementsByClassName(cls_str);

        if(x == undefined || x.length == 0)return;//bugfix for angular false positives

        if (n > x.length) {slideIndex = 1}
        if (n < 1) {slideIndex = x.length}
        for (i = 0; i < x.length; i++) {
           x[i].style.display = "none";
        }
        x[slideIndex-1].style.display = "flex";
      }//end showDivs

      this.setDisplay = function(ndx)
      {
        return (ndx < 1) ? "display:flex;" : "display:none;";
      }//setDisplay

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
          let c_h = ShowData.tool.views[boss.view].height;

          let auto_width = ShowData.tool.views[boss.view].auto_width;

          //hack
          let width_pct = (boss.responsive == '1' && ShowData.tool.views[boss.view].width_pct > 95) ? 95 : `${ShowData.tool.views[boss.view].width_pct}`;
          if(width_pct == "55"){
            let mesee_that_its = "55";
          }
          width_pct = parseFloat("." + width_pct);

          let orient = (c_w == c_h) ? "square" : (c_w > c_h) ? "landscape"  : "portrait";

          let is_responsive = boss.responsive;
          //console.log("process_size responsive = ",boss.responsive);

          //if responsive or if <= use the responsive classes
          //process width
          if(is_responsive == '1')
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

            let w_class = " d3S_w" + boss.rounded(w_pct);
            let h_class = "d3S_h" + boss.rounded(h_pct);


            let samp_w_class = " d3S_w" + parseInt(boss.rounded(w_pct * .80));
            let samp_h_class = "d3S_h" + parseInt(boss.rounded(h_pct  * .80));

            ShowData.tool.views[boss.view].class_style = " " + w_class + " " + h_class + " ";
            ShowData.tool.views[boss.view].class_alt = " " + samp_w_class + " " + samp_h_class + " ";

            let custom_class = " " + ShowData.tool.views[boss.view].class_pfx + " " + ShowData.tool.views[boss.view].class_style + " ";
            custom_class = ShowData.removeSomething(custom_class,' ');
            let sample_class = " " + ShowData.tool.views[boss.view].class_pfx + " " + ShowData.tool.views[boss.view].class_alt + " ";
            sample_class = ShowData.removeSomething(sample_class,' ');

            ShowData.tool.views[boss.view].custom_class = custom_class;
            ShowData.tool.views[boss.view].sample_class = sample_class;

            //console.log("class style = ",ShowData.tool.views[boss.view].class_style);
            //console.log("class alt = ",ShowData.tool.views[boss.view].class_alt);
          }else if(is_responsive == '2'){

            let width_pct = `${ShowData.tool.views[boss.view].width_pct}`;
            let w_class = " d3S_pw" + width_pct + " flexMode ";//" d3S_w" + w_nbr;

            w_class = ShowData.removeSomething(w_class,' ');

            ShowData.tool.views[boss.view].custom_class = w_class;
            ShowData.tool.views[boss.view].sample_class = w_class;

          }else {
            ShowData.tool.views[boss.view].custom_class = "";
            ShowData.tool.views[boss.view].sample_class = "";

          }//else
          //end if boss.mode
          boss.outer_style();

          ShowData.refresh_tool = "true";
        }

      }//process_size

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

      this.prep_opacity = async function()
      {
          let targ_el = event.target;

          //i need to compile the new color
          await boss.form_btn_color("opacity",targ_el.value);
          boss.form_btn_style();

      }//prep_color

      /*
      this.prep_color = async function(mod)
      {
        let targ_el = event.target;
            //i need to compile the new color
            await boss.form_btn_color(mod,targ_el.value);
            boss.form_btn_style();
            //$scope.$digest();
            $timeout(function(){},0,true);

        //return arguments.length ? (_name = newName) : _name;//I like this shortcut
      }//prep_color
      */

      this.prep_color = async function(mod,dest,param)
      {
        let targ_el = event.target;
        boss.prep_color2(targ_el.value,mod,dest,param)
        //return arguments.length ? (_name = newName) : _name;//I like this shortcut
      }//prep_color

      //hack for color.ctrlr.js
      this.prep_color2 = async function(val,mod,dest,param)
      {
            //i need to compile the new color
            await boss.form_item_color(val,mod,dest,param);
            boss.form_item_style(dest);
            //$scope.$digest();

        //return arguments.length ? (_name = newName) : _name;//I like this shortcut
      }//prep_color

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

              boss.service.tool.views[boss.view][dest][`${pfx}_base16`] = targ_nbr;
              boss.service.tool.views[boss.view][dest][`${pfx}_hex`] = boss.service.tool.views[boss.view][dest][`${pfx}_color`] + "" + targ_nbr;
              //boss.service.tool.views[boss.view].btn_opacity = parseInt(dat,10);
            break;

            case "color":
              boss.service.tool.views[boss.view][dest][`${pfx}_hex`] = dat + "" + boss.service.tool.views[boss.view][dest][`${pfx}_base16`];
              boss.service.tool.views[boss.view][dest][`${pfx}_color`] = dat;

              let hVal = `hex value = ${boss.service.tool.views[boss.view][dest][`${pfx}_hex`]}`
              //console.log(hVal);
            break;

            /*case "text":
              boss.service.tool.views[boss.view][dest][`${pref}_color`] = dat;
            break;*/
        }//end switch
      }//form_item_color

      this.prep_height = async function()
      {
        let targ_el = event.target;
            //i need to compile the new color
            await boss.form_btn_height(targ_el.value);
            //boss.form_btn_style();
            $timeout(function(){},0,true);

        //return arguments.length ? (_name = newName) : _name;//I like this shortcut
      }//prep_height

      this.form_btn_height = function(dat)
      {
        if(dat == undefined)return;
          let btn_grp = document.querySelectorAll(".sTMSS_Btn");
          let new_class = " d3S_ph" + dat + " ";

          btn_grp.forEach(function(entry){
            let dirty_class = entry.className;
            let clean_class = boss.weedOut(dirty_class,["d3_","d3S_","d3M_","d3L_","d3XL_"]);
            let class_final = clean_class + new_class;
            entry.className = ShowData.removeSomething(class_final,' ');
          });
          let dat_numb = (dat < 15) ? 15: (dat > 100) ? 100 : dat;
          boss.service.tool.views[boss.view].button.btn_height = parseInt(dat_numb,10);
          boss.service.tool.views[boss.view].button.btn_class = new_class;
      }//form_btn_height

      this.form_btn_color = function(mod,dat)
      {
        switch(mod)
        {
            case "opacity":
              let nbr = dat;//0 - 100
              let pct = parseInt(dat,10) / 100;
              let targ_nbr = (Math.floor(255 * pct)).toString(16);

              boss.service.tool.views[boss.view].btn_base16 = targ_nbr;
              boss.service.tool.views[boss.view].btn_hex = boss.service.tool.views[boss.view].btn_bg + "" + targ_nbr;
              //boss.service.tool.views[boss.view].btn_opacity = parseInt(dat,10);
            break;

            case "color":
              boss.service.tool.views[boss.view].btn_hex = dat + "" + boss.service.tool.views[boss.view].btn_base16;
              boss.service.tool.views[boss.view].btn_bg = dat;
            break;
        }//end switch
      }//form_btn_color

      this.form_btn_style = function()
      {
        boss.service.tool.views[boss.view].btn_style = "background-color:" + boss.service.tool.views[boss.view].btn_hex + " !important;";
      }//form_btn_style

      this.form_item_style = function(dest)
      {

          //let width = `width:${boss.service.tool.views[boss.view].width_pct}%;`;
          let target_detail = boss.service.tool.views[boss.view][dest];
          let display = (target_detail.display != undefined && target_detail.display != "") ?
          `display:${target_detail.display};` : "";
          let width = "";
          let height = "";
          let height_ctrl = target_detail.height_control || false;
          let txt_color = "";
          let bg_color = `background-color:${boss.service.tool.views[boss.view][dest].bg_hex};`;
          let justify = "";
          let align = "";
          let flow = "";
          let margin = "";
          let padding = "";
          let margin_measure = boss.service.tool.views[boss.view][dest].margin_measure || "rem";
          let padding_measure = boss.service.tool.views[boss.view][dest].padding_measure || "rem";

          let m_lft = (dest == "outer" && boss.service.tool.views[boss.view][dest].margin_left == boss.service.tool.views[boss.view][dest].margin_right) ?
          " auto " :  ` ${boss.service.tool.views[boss.view][dest].margin_left}${margin_measure} `;
          let m_rgt = (dest == "outer" && boss.service.tool.views[boss.view][dest].margin_left == boss.service.tool.views[boss.view][dest].margin_right) ?
          " auto " :  ` ${boss.service.tool.views[boss.view][dest].margin_right}${margin_measure} `;

            margin = ["margin: ",boss.service.tool.views[boss.view][dest].margin_top,`${margin_measure} `,
            m_rgt,
            boss.service.tool.views[boss.view][dest].margin_bottom,`${margin_measure} `,
            m_lft,`; `].join("");

            padding = ["padding: ",boss.service.tool.views[boss.view][dest].padding_top,`${padding_measure} `,
            boss.service.tool.views[boss.view][dest].padding_right,`${padding_measure} `,
            boss.service.tool.views[boss.view][dest].padding_bottom,`${padding_measure} `,
            boss.service.tool.views[boss.view][dest].padding_left,`${padding_measure}; `].join("");

          if(dest == "link"){

            margin_calc = boss.service.tool.views[boss.view][dest].margin_top + boss.service.tool.views[boss.view][dest].margin_bottom;

            padding_calc = boss.service.tool.views[boss.view][dest].padding_top + boss.service.tool.views[boss.view][dest].padding_bottom;

            boss.service.tool.views[boss.view][dest].outer_calc = margin_calc + padding_calc;

          }

          justify = (target_detail.justify != undefined && target_detail.justify != "") ?
          ` justify-content:${target_detail.justify}; ` : "";

          align = (target_detail.align != undefined && target_detail.align != "") ?
          ` align-items:${target_detail.align}; ` : "";

          flow = (target_detail.flow != undefined && target_detail.flow != "") ?
          ` flex-flow:${target_detail.flow}; ` : "";

          let border_style = "";
          if(boss.service.tool.views[boss.view][dest].active_border == true){
            border_style = `border:${boss.service.tool.views[boss.view][dest].border_width}px solid ${boss.service.tool.views[boss.view][dest].border_color};`
            + ` border-radius:${boss.service.tool.views[boss.view][dest].border_radius}px; `;
          }

          let column = "";
          if(dest == "content" || boss.service.tool.views[boss.view][dest].width_pct != undefined)
          {
            let col_class = "";
            let flex_class = (boss.service.tool.views[boss.view][dest].flex_fill === true) ? "flex_fill" : "";
            let mobile_margin = (boss.service.tool.views[boss.view][dest].mobile_margin === true) ? "mobile_m" : "";
            let mobile_padding = (boss.service.tool.views[boss.view][dest].mobile_padding === true) ? "mobile_p" : "";

            col_class += (boss.service.tool.views[boss.view][dest].width_pct != undefined ) ?
            ` d3S_pw${boss.service.tool.views[boss.view][dest].width_pct} ` : "";


            col_class += (height_ctrl == true && target_detail.height_pct != undefined ||
            height_ctrl == "percent" && target_detail.height_pct != undefined ) ?
            ` d3S_ph${target_detail.height_pct} ` : "";

            col_class += ` ${flex_class} ${mobile_margin} ${mobile_padding} `
            col_class = ShowData.removeSomething(col_class," ");
            let me_seeks_class = boss.service.tool.views[boss.view][dest].custom_class;
            //console.log("me_seeks_class = ",me_seeks_class);

            boss.service.tool.views[boss.view][dest].custom_class = col_class;
          }else {

            let mobile_margin = (boss.service.tool.views[boss.view][dest].mobile_margin === true) ? "mobile_m" : "";
            let mobile_padding = (boss.service.tool.views[boss.view][dest].mobile_padding === true) ? "mobile_p" : "";

            let c_class = ` ${mobile_margin} ${mobile_padding} `;
            c_class = ShowData.removeSomething(c_class," ");

            boss.service.tool.views[boss.view][dest].custom_class = c_class;
          }

          let advanced_style = (boss.service.exists(target_detail.advanced_style)) ?
            target_detail.advanced_style : "";


          height = (height_ctrl == "direct" && target_detail.height != undefined &&
          target_detail.height_measure != undefined) ?
          height = `height:${target_detail.height}${target_detail.height_measure}` :
          "";

          boss.service.tool.views[boss.view][dest].style = display + width + height + bg_color +
          margin + border_style + padding + txt_color + justify + align + flow + advanced_style;

          if(boss.service.tool.views[boss.view][dest].auto_same_paddings != undefined)
          {delete boss.service.tool.views[boss.view][dest].auto_same_paddings}
      //boss.service.tool.views[boss.view][dest].btn_style = "background-color:" + boss.service.tool.views[boss.view].btn_hex + " !important;";

        boss.soft_apply();

      }//form_item_style

      this.link = function(lnk)
      {
        //window.location.replace(lnk);
        window.location.href = lnk;
      }//link

      this.test_link = function(dest,lObj,fc)
      {
        //test_link check to see if the item is linkable first
        let force = fc || false;
        let link = lObj.url || "";
        let anchor = lObj.anchor || "";
        let full_link = (link != "" && anchor != "") ? `${link}/#${anchor}` : link;
        let linkable = boss.service.tool.views[boss.view][dest].linkable || false;
        if(force == false && linkable !== true || link == "")return;
        //window.location.replace(lnk);
        boss.link(full_link);
      }//link

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
            //boss.service.tool.views[boss.view][dest].auto_same_margins = false;
          }else {
            margin_boxes.forEach(function(entry){
              entry.checked = false;
            });
            //boss.service.tool.views[boss.view][dest].auto_same_margins = true;
          }
        break;

        default:
        margin_str = `.${dest}_margin_box`;
        margin_boxes = document.querySelectorAll(margin_str);
        margin_boxes.forEach(function(entry){
          if(entry.checked)
          {
            let el_param = entry.dataset.param;

              boss.service.tool.views[boss.view][dest][el_param] = boss.service.tool.views[boss.view][dest].margin_value;

          }//if
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
            //boss.service.tool.views[boss.view][dest].auto_same_paddings = false;
          }else {
            padding_boxes.forEach(function(entry){
              entry.checked = false;
            });
            //boss.service.tool.views[boss.view][dest].auto_same_paddings = true;
          }
        break;

        default:
        padding_str = `.${dest}_padding_box`;
        padding_boxes = document.querySelectorAll(padding_str);
        padding_boxes.forEach(function(entry){
          if(entry.checked)
          {
            let el_param = entry.dataset.param;
            boss.service.tool.views[boss.view][dest][el_param] = boss.service.tool.views[boss.view][dest].padding_value;
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
            //boss.service.tool.views[boss.view][dest].auto_same_borders = false;
          }else {
            border_boxes.forEach(function(entry){
              entry.checked = false;
            });
            //boss.service.tool.views[boss.view][dest].auto_same_borders = true;
          }
        break;

        default:
        border_str = `.${dest}_border_box`;
        border_boxes = document.querySelectorAll(border_str);
        border_boxes.forEach(function(entry){
          if(entry.checked)
          {
            let el_param = entry.dataset.param;
            boss.service.tool.views[boss.view][dest][el_param] = boss.service.tool.views[boss.view][dest].border_width_value;
          }
        });

        boss.form_item_style(dest);
      }//switch


      }//make_border

      this.getStyle = function()
      {
        let use_style = (boss.mode == "admin") ? ShowData.tool.views[boss.view].samp_h_nbr: ShowData.tool.views[boss.view].h_nbr;

        //return `min-height:${ShowData.tool.views[boss.view].height}px;`;
        return (ShowData.tool.views[boss.view].content.height_style == 'strict') ? `height:${ShowData.tool.views[boss.view].content.height_pct}%;` : ` height:fit-content; `;
      }//getStyle


      this.is_responsive = function(nbr)
      {
        //console.log("is_responsive nbr = ",nbr);
        ShowData.tool.views[boss.view].responsive = nbr;
        /*switch(str)
        {
          case "yes":
            ShowData.tool.views[boss.view].responsive = "1";
          break;
          case "no":
            ShowData.tool.views[boss.view].responsive = "0";
          break;
        }//switch*/
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
          let mk_btn_col = ShowData.tool.views[boss.view].button.btn_hov + boss.service.tool.views[boss.view].button.bg_base16;
            targ_btn.style.backgroundColor = mk_btn_col;
            targ_icon.style.color = ShowData.tool.views[boss.view].button.icon_hov;

          break;

          case "leave":
            targ_btn.style.backgroundColor = ShowData.tool.views[boss.view].button.bg_hex;
            targ_icon.style.color = ShowData.tool.views[boss.view].button.icon_bg;
          break;
        }//switch
      }//btn_hover

      this.slick_click = function(dir)
      {
        //ng-click="take1.slick_click('prev')"
        //let cont = `.bM_slider_${boss.iUN}`;
        let cont = `.showTime_img_cont_${boss.iUN}`;
        let btn_str = `slick-${dir}`;
        let bigDaddy = document.querySelector(cont);
        let targ_btn = bigDaddy.getElementsByClassName(btn_str)[0];

        targ_btn.click();

      }//slick_click


      this.slick_refresh = function()
      {
        let targ_slider = `.showTime_img_cont_${boss.iUN}`;
        let targ_el = document.querySelector(targ_slider);
        if(targ_el == undefined || targ_el.slick == undefined)return;
        targ_el.slick.refresh();
        //targ_el.slick.setPosition();
        //targ_el.slick('resize');
        boss.soft_apply();
      }//slick_refresh

      this.slick_fade = function (fStr)
      {
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

            // let has_view = (boss.exists(boss._.tool.views[view_str])) ? true : false;
            let active_view = (boss.exists(boss._.tool.views[view_str])  &&
            boss.exists(boss._.tool.views[view_str].active_view)) ? true : false;

            // if(boss.view != view_str && active_view == true)
            // {
            //   boss._.refresh_tool = "true";
            // }//if

            if(boss.service.current_view != view_str)
            {
              // if the current view changes
              boss.service.current_view = view_str;
              boss._.refresh_tool = "true";
            }//if

            // if theres an active view switch to the view
            if(boss.mode == "admin" /*&& has_view*/ || active_view )
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

      this.get_view_size = function ()
      {
        let size_ary = {small:"mobile",medium:"tablet",large:"desktop",xlarge:"max"}
        let device_size = boss.get_device_size();
        //if its active change the view
        let view_str = size_ary[device_size];
        return view_str;
      }// get_view_size


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
        if(boss.service.tool.views[boss.view].invisible == true)
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
        if(boss.service.tool.views[boss.view].invisible == true)
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
        let obj_keys = (check != "all") ? [check] : Object.keys(boss.service.tool.views[boss.view]);
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
          let targ_obj = boss.service.tool.views[boss.view][dest];
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

      this.el_pfx = "blogMod";

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
        return boss.view;

      }//get_view


      this.get_select_props = function(mod)
      {
        //this preps a new array of a select menus dropdown options (custom_keys/view_keys)
        return new Promise(function(resolve, reject) {
          //if(boss.service.tool.views[boss.view].custom == undefined){boss.service.tool.views[boss.view].custom = {};}
          let targ_obj = (mod == "custom") ? boss.service.tool.views[boss.view] :
          boss.service.tool.views;
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
            mod_t_c_t = boss.service.removeSomething(mod_t_c_t," ")
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
            let details_length = (mod == "custom") ? (Object.keys(boss.service.tool.views[boss.view])).length :
            (Object.keys(boss.service.tool.views)).length;
            let current_select = "";
            for(let i = 1; i < details_length +1; i++)
            {
              //test for existing names
              let test_specimen = (mod == "custom") ? boss.service.tool.views[boss.view] :
              boss.service.tool.views;
              if(test_specimen[`${name_gen_str}${i}`] == undefined)
              {
                if(mod == "custom"){
                  test_specimen[`${name_gen_str}${i}`] = {};
                }else {
                  test_specimen[`${name_gen_str}${i}`] = boss.service.bboy(boss.service.tool.views.default);
                }//if

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


            //   let targ_sel_str = (mod == "custom") ? boss.custom_select: boss.view_select;
            //   let select_el = document.querySelector(`.${targ_sel_str}`);
            //   var accessIndex = boss.service.getSelectedValue(`.${targ_sel_str}`,"value_index",current_select);
            //
            //   //update the select menu's display and change the destination
            //   //value to reflect the new data
            //   select_el.selectedIndex = accessIndex;
            //   boss.soft_apply(boss.remote_loader,"hide")
            //   .then(function(){
            //     // destination tells the advanced options which option to display
            //     // could be main or content or custom1
            //     if(mod == "custom"){
            //       //this is only really run when its made
            //       boss.destination = current_select;
            //     }//if
            //   });
              boss.update_select_menu(current_select,mod);
            });//.then


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
              let par_name =  boss.service.tool.module_position;
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
        let measure = (boss.service.tool.views[boss.view][dest].measure != undefined && boss.service.tool.views[boss.view][dest].measure != "") ?
        boss.service.tool.views[boss.view][dest].measure : "";
        let height = (boss.service.tool.views[boss.view][dest].height != undefined && boss.service.tool.views[boss.view][dest].height != "" ) ?
        boss.service.tool.views[boss.view][dest].height : "";
        return (measure != "" && height != "") ? `height:${boss.service.tool.views[boss.view][dest].height}${measure};` : "";
      }//getHeight

      this.rivals = function(dest,active,adjust)
      {//deprecated - use link_vars

        switch (dest)
        {
          case 'root':
            if(boss.service.tool.views[boss.view][dest][active] == true)
            {
              boss.service.tool.views[boss.view][dest][adjust] = false;
            }
          break;
          default:
            if(boss.service.tool.views[boss.view][dest][active] == true)
            {
              boss.service.tool.views[boss.view][dest][adjust] = false;
            }
        }//switch
      }//rivals


      this.remove_select = function(dest,mod)
      {
        if(dest.match(/custom\d+/g) == false) return;
        if(mod == "view" && dest == "default") return;

        let targ_obj = (mod == "custom") ? boss.service.tool.views[boss.view] :
         boss.service.tool.views;
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
              var accessIndex = boss.service.getSelectedValue(`.${targ_sel_str}`,"value_index","default");
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

      /******  dynamic templates *******/
      //switch between navigate (slick) and no navigation

      this.finally = function(uN)
      {
        boss.manage_dots(uN);//manage external dot position

      }//finally

      this.manage_dots = function(uN)
      {
        //check for nav, dots & dot position
        //let nav = boss.service.tool.views[boss.view].navigation || false;
        let active_dots = (boss.service.tool.views[boss.view].button != undefined &&
        boss.service.tool.views[boss.view].button.nav_dots != undefined &&
        boss.service.tool.views[boss.view].button.nav_dots != "") ? boss.service.tool.views[boss.view].button.nav_dots : false;

        let iUN = uN;

        if(/*nav &&*/ active_dots)
        {
          let targ_el = document.querySelector(`.showTime_img_cont_${iUN}`);
          let dot_position = boss.service.tool.views[boss.view].button.dot_position || "";

          if(!targ_el)return;
          let dot_element = targ_el.querySelector(`.slick-dots`);

          if(!dot_element || dot_position == "")return;
          let bottom = `${dot_position}px`;

          let dot_mode = boss.service.tool.views[boss.view].button.dot_mode || "layered";

          if(dot_mode == "layered"){
            dot_element.style.bottom = `${bottom}`;
            dot_element.style.position = `absolute`;
          }else{
            dot_element.style.position = `unset`;
          }
          //boss.slick_refresh();

        }//if
      }//manage_dots

      this.loaded = function(lst,uN)
      {
        //add final functions to boss.finally
        let last = lst;
        if(last !== true)return;

        //write final codes here
        boss.finally(uN);
        //boss.soft_apply(boss.finally,uN)

      }

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
        boss.service.activate_template(boss.service.tool);
      }//setTemplateStyle

      this.template_styles = {};
      this.template_styles.options = mSS_temps;
      this.template_styles.label = "basic";

      /*
      var mSS_temps = {
        "basic":"basic",
        "full":"full"
      }
      */

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
        let obj_keys = Object.keys(boss.service.tool.views[boss.view]);
        let sample_array = boss.proper_properties;
        boss.tool_properties = [];

        obj_keys.forEach(function(entry)
        {
            ///custom[0-9]/g - works but only matches 1 digit
            //filter for approved/proper properties or 'custom' pfx
            let is_in_array = ShowData.valueChecker({"array":sample_array,"string":entry,"mod":"index","type":"sna","action":"match"});

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

      //boss.make_tool_properties();//run below soft_apply declaration


      /****** end dynamic templates *******/

      this.refresh = function()
      {
        $scope.$digest();

        //look into switching to this it doesn't cause a conflict in the digest cycle
        //$timeout(function(){},0,true);

      }//refresh

      this.me_seeks= function(data)
      {
        boss;
        if(data != undefined)
        {
          //console.log("here comes data",data);
        }
        let tVar = data || "";
        //console.log("im working",tVar);
        return true;

      }//me_seeks

      this.hnic = function()
      {
        return (boss.service.tool.file_name == boss.file_name) ? true : false;
      }//hnic

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

    }],
    controllerAs:"take1",
    bindToController:true
  };
}]);

  var mSS_temps = {
    "basic":"basic",
    "full":"full",
    "navigate":"navigate"
  }

})();
