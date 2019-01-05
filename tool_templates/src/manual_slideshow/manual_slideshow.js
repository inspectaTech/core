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

      let urlStr = `${attr.home}tool_templates/src/${file_name}/templates/${template_style}.html`;

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
    //+ '<div ng-if="take1.motiv == \'settings\'">switched to settings \n data params = {{take1._.current_tool.params.data}}'
    + '<div class="mSS_stgs" ng-if="take1.motiv == \'settings\'">'
    + '<h5 class="mSS_stgs_label">manual slideshow settings</h5>'
    + '<div class="mSS_stgs_current_info mSS_stgs_content_box">'
      + '<label title="size of your current viewport (above the fold)">current screen size:</label>'
      + '<div>height:   {{take1.screen_width}}</div>'
      + '<div>width:   {{take1.screen_height}}</div>'
    + '</div><!--ends current info-->'
    + '<div class="mSS_stgs_custom_info mSS_stgs_content_box">'
      + '<label title="customize the size your slideshow should be compared to the viewport">custom size:</label>'
      + '<div class="mSS_stgs_size_wrapr"><div class="mSS_stgs_size_wrapr">width:</div><input class="mSS_stgs_custom_input" type="text" ng-model="take1._.tool.views[boss.view].width"></div>'
      + '<div class="mSS_stgs_size_wrapr"><div >height:</div><input class="mSS_stgs_custom_input" type="text" ng-model="take1._.tool.views[boss.view].height"></div>'
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
          //el_ctrlr._.resize_id ++;
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
    controller:["ShowData","CoStars","$sce","$scope","$timeout",function(ShowData,CoStars,$sce,$scope,$timeout){

      var boss = this;
      this.service = ShowData;
      this._ = ShowData;
      this._c = CoStars;

      if(boss._.tool.file_name != "manual_slideshow")return;

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
      this._.resize_id = 0;
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
          if(boss._.tool.file_name != "manual_slideshow")return;
          boss.file_name = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss.view}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
          if(boss._.tool.file_name != "manual_slideshow")return;
          boss._.current_view = newValue;
          boss.make_tool_properties();
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.view}, function (newValue, oldValue, scope) {
        if (newValue)

        if(boss._.tool.file_name != "manual_slideshow")return;

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
          if(boss._.tool.file_name != "manual_slideshow")return;
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
          if(boss._.tool.file_name != "manual_slideshow")return;
          boss.process_size();
        }//end if
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.preview_display}, function (newValue, oldValue, scope) {
        if (newValue){

          if(boss.initiated == true)
          {
            if(boss._.tool.file_name != "manual_slideshow")return;
            boss.process_size();
          }//end if
        }
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);


      $scope.$watch(function(){
        return boss._.tool.views[boss.view].custom_class
      }, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        boss.cast = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.tool.views[boss.view].width_pct}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        //boss.cast = newValue;
        if(boss._.tool.file_name != "manual_slideshow")return;
        boss.process_size();
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.tool.views[boss.view].auto_width}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        //boss.cast = newValue;
        if(boss._.tool.file_name != "manual_slideshow")return;
        boss.process_size();
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      //do i need this $watch?
      $scope.$watch(function(){return boss._.tool.views[boss.view].sample_class}, function (newValue, oldValue, scope) {
        if (newValue){
          //boss.my_stars = newValue;
        //boss.alternate = newValue;
        }
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      //watch for ShowData.tool changes
      $scope.$watch(function(){return boss._.tool}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        boss.tool = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
        if(boss._.tool.file_name != "manual_slideshow")return;
          boss.process_size();

      }, true);

      $scope.$watch(function(){return boss._.tool.views[boss.view]}, function (newValue, oldValue, scope) {
        if (newValue){
          if(boss._.tool.file_name != "manual_slideshow")return;
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

        boss._.current_view = boss.get_view_size();

        if(boss._.tool.notes == undefined)
        {
          boss._.tool.notes = "";
        }//if

        boss.update_view()
        .catch(function(err){
          //console.log('not on my watch')
        });;

        await boss.make_tool_properties();

        boss._.screen_width = document.body.clientWidth;
        boss._.screen_height = document.body.clientHeight;
        //let venue = document.querySelector(boss.front_stage).parentNode;
        //boss._.screen_width = venue.clientWidth;
        //boss._.screen_height = venue.clientHeight;//probably won't have dimensions till i fill it?

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
           $scope.$watch(function(){return boss._.tool.views[boss.view].width}, function (newValue, oldValue, scope) {
             if (newValue)
               //boss.my_stars = newValue;
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
               //boss.my_stars = newValue;
             boss.responsive = newValue;
             //console.log("i see a change in responsive = ",boss.responsive);
             $timeout(function(){
               //console.log("responsive timeout running!");
               if(boss.initiated == true)
               {
                 if(boss._.tool.file_name != "manual_slideshow")return;
                 boss.process_size();
               }//end if
             },0,true);
           }, true);

           //window.dispatchEvent(new Event('resize'));
        });//end .then() of $timeout

        return;

      };//end onInit


      this.getAssets = boss._c.getAssets.bind(this);


      this.update_assets = boss._c.update_assets.bind(this);

      this.outer_array = [
        "d3_","d3S_","d3M_",
        "d3L_","d3XL_","nav_blog",
        "h_nav","v_nav",
        "d3_hide_small","d3_hide_medium",
        "d3_hide_large","invisible"
      ];

      this.outer_style = function(){
        // unique
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
        let hide_small = (boss._.tool.views[boss.view].hide_small == true) ? " d3_hide_small " : "";
        let hide_medium = (boss._.tool.views[boss.view].hide_medium == true) ? " d3_hide_medium " : "";
        let hide_large = (boss._.tool.views[boss.view].hide_large == true) ? " d3_hide_large " : "";

        //restrict action to site/client side display
        let device_limits = (boss.mode != "admin" && boss._.tool.views[boss.view].limit_devices == true) ? ` ${hide_small} ${hide_medium} ${hide_large} ` : "";

        let invisible = (boss.mode != "admin" && boss._.tool.views[boss.view].invisible == true) ? " invisible " : "";

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
        use_class = `${use_class} ${boss._.tool.views[boss.view].alt_class}`;
        use_class = ShowData.removeSomething(use_class," ");
        return use_class;
      }//getClass_OG

      /***  blogMod section ***/
      this.getClass = function(str)
      {
        // unique
        let use_class = "";
        let type = (str.match(/custom\d+/g)) ? "custom" : str;
        let target_detail = ShowData.tool.views[boss.view][str];
        let advanced_class = "";

        switch (type) {
          case "outer":
            advanced_class = (boss._.exists(target_detail.advanced_class)) ?
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

            advanced_class = (boss._.exists(target_detail.advanced_class)) ?
            target_detail.advanced_class : "";

            use_class = `${use_class} ${advanced_class}`;

            use_class = `${use_class} ${ShowData.tool.views[boss.view][str].custom_class} `;
            use_class = (ShowData.tool.views[boss.view][str].ellipsis === true) ? `${use_class} clamp ` : use_class;
            use_class = (str == 'content' && ShowData.tool.views[boss.view][str].card_styling != false) ? `${use_class} w3-card ` : use_class;
            use_class = ShowData.removeSomething(use_class," ");
          break;

          case "link":
            //use_class = (ShowData.tool.views[boss.view].link.shadow_mode === true) ? ` ${ShowData.tool.views[boss.view].link.shadow} ` : "";
            advanced_class = (boss._.exists(target_detail.advanced_class)) ?
            target_detail.advanced_class : "";

            use_class = `${use_class} ${advanced_class}`;
            use_class = (ShowData.tool.views[boss.view].link.active_width === true) ? `${use_class} d3_pmw${ShowData.tool.views[boss.view].link.width_pct} ` : use_class;
            use_class += ` ${ShowData.tool.views[boss.view].link.custom_class} `;

            use_class = (ShowData.tool.views[boss.view][str].card_styling != false) ? `${use_class} w3-card ` : use_class;
            use_class = ShowData.removeSomething(use_class," ");
          break;

          default:
            advanced_class = (boss._.exists(target_detail.advanced_class)) ?
            target_detail.advanced_class : "";

            use_class = `${use_class} ${advanced_class}`;
            use_class = (boss.mode == "admin") ? `${use_class} ${ShowData.tool.views[boss.view].sample_class}`: `${use_class} ${ShowData.tool.views[boss.view].custom_class}`;
            use_class = `${use_class} ${boss._.tool.views[boss.view].alt_class}`;
            use_class = ShowData.removeSomething(use_class," ");

        }//switch
        return use_class;
      }//getClass

      this.getStyle = function()
      {
        return (ShowData.tool.views[boss.view].height_style == 'strict') ? `height:${ShowData.tool.views[boss.view].height}px;` : "";
      }//getStyle

      this.get_adv_design = boss._c.get_adv_design.bind(this);

      this.getParam = boss._c.getParam.bind(this);


      this.getTextStyle = function(data,src)
      {
        // unique
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

      this.setLinkHover = boss._c.setLinkHover.bind(this);

      // this.active_content = boss._c.active_content.bind(this);
      this.active_content = function(action)
      {
        // unique
        let active_title = boss._.tool.views[boss.view].title.active_title;
        let active_body = boss._.tool.views[boss.view].body.active_body;
        let active_link = boss._.tool.views[boss.view].link.active_link;
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

      this.weedOut = boss._c.weedOut.bind(this);


      this.insertCanvas = function(dt,lst)
      {
        // unique
        if(boss._.tool.file_name != "manual_slideshow")return;

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

      this.image_object_converter = boss._c.image_object_converter.bind(this);

      this.canvas_mkr = function(cObj)
      {
        // unique
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

      this.plusDivs = boss._c.plusDivs.bind(this);

      this.showDivs = function(n) {
        // unique
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
        x[slideIndex-1].style.display = "flex";
      }//end showDivs

      this.setDisplay = function(ndx)
      {
        return (ndx < 1) ? "display:flex;" : "display:none;";
      }//setDisplay

      this.process_size = boss._c.process_size.bind(this);

      this.get_ratio = boss._c.get_ratio.bind(this);

      this.rounded = boss._c.rounded.bind(this);

      this.prep_opacity = async function()
      {
          let targ_el = event.target;

          //i need to compile the new color
          await boss.form_btn_color("opacity",targ_el.value);
          boss.form_btn_style();

      }// prep_opacity

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

      this.prep_color = boss._c.prep_color.bind(this);

      //hack for color.ctrlr.js
      this.prep_color2 = boss._c.prep_color2.bind(this);

      this.form_item_color = boss._c.form_item_color.bind(this);

      this.prep_height = boss._c.prep_height.bind(this);

      this.form_btn_height = function(dat)
      {
        // exclusive/unique
        // doesn't have function(dat,dest,cls)

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
          boss._.tool.views[boss.view].button.btn_height = parseInt(dat_numb,10);
          boss._.tool.views[boss.view].button.btn_class = new_class;
      }//form_btn_height

      this.form_btn_color = function(mod,dat)
      {
        switch(mod)
        {
            case "opacity":
              let nbr = dat;//0 - 100
              let pct = parseInt(dat,10) / 100;
              let targ_nbr = (Math.floor(255 * pct)).toString(16);

              boss._.tool.views[boss.view].btn_base16 = targ_nbr;
              boss._.tool.views[boss.view].btn_hex = boss._.tool.views[boss.view].btn_bg + "" + targ_nbr;
              //boss._.tool.views[boss.view].btn_opacity = parseInt(dat,10);
            break;

            case "color":
              boss._.tool.views[boss.view].btn_hex = dat + "" + boss._.tool.views[boss.view].btn_base16;
              boss._.tool.views[boss.view].btn_bg = dat;
            break;
        }//end switch
      }//form_btn_color

      this.form_btn_style = function()
      {
        boss._.tool.views[boss.view].btn_style = "background-color:" + boss._.tool.views[boss.view].btn_hex + " !important;";
      }//form_btn_style

      this.form_item_style = function(dest)
      {
        //unique
          //let width = `width:${boss._.tool.views[boss.view].width_pct}%;`;
          let target_detail = boss._.tool.views[boss.view][dest];
          let display = (target_detail.display != undefined && target_detail.display != "") ?
          `display:${target_detail.display};` : "";
          let width = "";
          let height = "";
          let height_ctrl = target_detail.height_control || false;
          let txt_color = "";
          let bg_color = `background-color:${boss._.tool.views[boss.view][dest].bg_hex};`;
          let justify = "";
          let align = "";
          let flow = "";
          let margin = "";
          let padding = "";
          let margin_measure = boss._.tool.views[boss.view][dest].margin_measure || "rem";
          let padding_measure = boss._.tool.views[boss.view][dest].padding_measure || "rem";

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

          if(dest == "link"){

            margin_calc = boss._.tool.views[boss.view][dest].margin_top + boss._.tool.views[boss.view][dest].margin_bottom;

            padding_calc = boss._.tool.views[boss.view][dest].padding_top + boss._.tool.views[boss.view][dest].padding_bottom;

            boss._.tool.views[boss.view][dest].outer_calc = margin_calc + padding_calc;

          }

          justify = (target_detail.justify != undefined && target_detail.justify != "") ?
          ` justify-content:${target_detail.justify}; ` : "";

          align = (target_detail.align != undefined && target_detail.align != "") ?
          ` align-items:${target_detail.align}; ` : "";

          flow = (target_detail.flow != undefined && target_detail.flow != "") ?
          ` flex-flow:${target_detail.flow}; ` : "";

          let border_style = "";
          if(boss._.tool.views[boss.view][dest].active_border == true){
            border_style = `border:${boss._.tool.views[boss.view][dest].border_width}px solid ${boss._.tool.views[boss.view][dest].border_color};`
            + ` border-radius:${boss._.tool.views[boss.view][dest].border_radius}px; `;
          }

          let column = "";
          if(dest == "content" || boss._.tool.views[boss.view][dest].width_pct != undefined)
          {
            let col_class = "";
            let flex_class = (boss._.tool.views[boss.view][dest].flex_fill === true) ? "flex_fill" : "";
            let mobile_margin = (boss._.tool.views[boss.view][dest].mobile_margin === true) ? "mobile_m" : "";
            let mobile_padding = (boss._.tool.views[boss.view][dest].mobile_padding === true) ? "mobile_p" : "";

            col_class += (boss._.tool.views[boss.view][dest].width_pct != undefined ) ?
            ` d3S_pw${boss._.tool.views[boss.view][dest].width_pct} ` : "";


            col_class += (height_ctrl == true && target_detail.height_pct != undefined ||
            height_ctrl == "percent" && target_detail.height_pct != undefined ) ?
            ` d3S_ph${target_detail.height_pct} ` : "";

            col_class += ` ${flex_class} ${mobile_margin} ${mobile_padding} `
            col_class = ShowData.removeSomething(col_class," ");
            let me_seeks_class = boss._.tool.views[boss.view][dest].custom_class;
            //console.log("me_seeks_class = ",me_seeks_class);

            boss._.tool.views[boss.view][dest].custom_class = col_class;
          }else {

            let mobile_margin = (boss._.tool.views[boss.view][dest].mobile_margin === true) ? "mobile_m" : "";
            let mobile_padding = (boss._.tool.views[boss.view][dest].mobile_padding === true) ? "mobile_p" : "";

            let c_class = ` ${mobile_margin} ${mobile_padding} `;
            c_class = ShowData.removeSomething(c_class," ");

            boss._.tool.views[boss.view][dest].custom_class = c_class;
          }

          let advanced_style = (boss._.exists(target_detail.advanced_style)) ?
            target_detail.advanced_style : "";


          height = (height_ctrl == "direct" && target_detail.height != undefined &&
          target_detail.height_measure != undefined) ?
          height = `height:${target_detail.height}${target_detail.height_measure}` :
          "";

          boss._.tool.views[boss.view][dest].style = display + width + height + bg_color +
          margin + border_style + padding + txt_color + justify + align + flow + advanced_style;

          if(boss._.tool.views[boss.view][dest].auto_same_paddings != undefined)
          {delete boss._.tool.views[boss.view][dest].auto_same_paddings}
      //boss._.tool.views[boss.view][dest].btn_style = "background-color:" + boss._.tool.views[boss.view].btn_hex + " !important;";

        boss.soft_apply();

      }//form_item_style

      this.link = boss._c.link.bind(this);

      this.test_link = boss._c.test_link.bind(this);

      this.make_margin = boss._c.make_margin.bind(this);

      this.make_padding = boss._c.make_padding.bind(this);


      this.make_border = boss._c.make_border.bind(this);

      this.getStyle = function()
      {
        //unique
        let use_style = (boss.mode == "admin") ? ShowData.tool.views[boss.view].samp_h_nbr: ShowData.tool.views[boss.view].h_nbr;

        //return `min-height:${ShowData.tool.views[boss.view].height}px;`;
        return (ShowData.tool.views[boss.view].content.height_style == 'strict') ? `height:${ShowData.tool.views[boss.view].content.height_pct}%;` : ` height:fit-content; `;
      }//getStyle


      this.is_responsive = function(nbr)
      {
        // unique
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
        // unique
        let btn_txt = (cStr == "left") ? "sTMSS_L_Btn" : "sTMSS_R_Btn";
        let icon_txt = (cStr == "left") ? "sTMSS_L_Icon" : "sTMSS_R_Icon";
        let btn_string = "." + btn_txt + mID;
        let icon_string = "." + icon_txt + mID;
        let targ_btn = document.querySelector(btn_string);
        let targ_icon = document.querySelector(icon_string);

        switch(str)
        {
          case "enter":
          let mk_btn_col = ShowData.tool.views[boss.view].button.btn_hov + boss._.tool.views[boss.view].button.bg_base16;
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
        // unique
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
        // unique
        let targ_slider = `.showTime_img_cont_${boss.iUN}`;
        let targ_el = document.querySelector(targ_slider);
        if(targ_el == undefined || targ_el.slick == undefined)return;
        targ_el.slick.refresh();
        //targ_el.slick.setPosition();
        //targ_el.slick('resize');
        boss.soft_apply();
      }//slick_refresh

      this.slick_fade = boss._c.slick_fade.bind(this);

      this.form_reset = boss._c.form_reset.bind(this);


      //this has to run once everything is finished loading so i put it in $onInit
      //this.showDivs(slideIndex);


      /******  custom section *******/

      this.get_device_size = boss._c.get_device_size.bind(this);

      this.update_view = boss._c.update_view.bind(this);

      this.get_view_size = function ()
      {
        let size_ary = {small:"mobile",medium:"tablet",large:"desktop",xlarge:"max"}
        let device_size = boss.get_device_size();
        //if its active change the view
        let view_str = size_ary[device_size];
        return view_str;
      }// get_view_size


      this.select_image_ndx = boss._c.select_image_ndx.bind(this);

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

      this.prep_custom = boss._c.prep_custom.bind(this);

      this.getAnchor = boss._c.getAnchor.bind(this);

      this.has_destination = boss._c.has_destination.bind(this);

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

      this.get_view = boss._c.get_view.bind(this);


      this.get_select_props = boss._c.get_select_props.bind(this);

      this.prep_view = boss._c.prep_view.bind(this);

      boss.get_select_props("custom");
      boss.get_select_props("view");

      this.make_select = boss._c.make_select.bind(this);

      this.update_select_menu = boss._c.update_select_menu.bind(this);

      this.remote_loader = boss._c.remote_loader.bind(this);

      this.is_custom = boss._c.is_custom.bind(this);

      this.not_custom = boss._c.not_custom.bind(this);

      this.process_custom_element = boss._c.process_custom_element.bind(this);

      this.declare_last = boss._c.declare_last.bind(this);

      $scope.$on('repeatDone', function(event,data)
      {

        if(data.toolname != "blogMod" || data.iun != boss.iUN )return;
          console.log('good to go');

          let meseeks = "repeat done";
          boss.repeat_done(data.last);
      });

      this.delay_nested = boss._c.delay_nested.bind(this);

      this.parse_custom = boss._c.parse_custom.bind(this);

      this.customize = boss._c.customize.bind(this);

      this.getHeight = boss._c.getHeight.bind(this);

      this.rivals = boss._c.rivals.bind(this);


      this.remove_select = boss._c.remove_select.bind(this);

      this.remove_view = boss._c.remove_view.bind(this);


      /******  end custom section *******/

      /******  dynamic templates *******/
      //switch between navigate (slick) and no navigation

      this.finally = function(uN)
      {
        boss.manage_dots(uN);//manage external dot position

      }//finally

      this.manage_dots = function(uN)
      {
        // unique
        //check for nav, dots & dot position
        //let nav = boss._.tool.views[boss.view].navigation || false;
        let active_dots = (boss._.tool.views[boss.view].button != undefined &&
        boss._.tool.views[boss.view].button.nav_dots != undefined &&
        boss._.tool.views[boss.view].button.nav_dots != "") ? boss._.tool.views[boss.view].button.nav_dots : false;

        let iUN = uN;

        if(/*nav &&*/ active_dots)
        {
          let targ_el = document.querySelector(`.showTime_img_cont_${iUN}`);
          let dot_position = boss._.tool.views[boss.view].button.dot_position || "";

          if(!targ_el)return;
          let dot_element = targ_el.querySelector(`.slick-dots`);

          if(!dot_element || dot_position == "")return;
          let bottom = `${dot_position}px`;

          let dot_mode = boss._.tool.views[boss.view].button.dot_mode || "layered";

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

      this.setSelect = boss._c.setSelect.bind(this);

      this.setTemplateStyle = function()
      {
        boss._.activate_template(boss._.tool);
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

      this.available_option = boss._c.available_option

      this.unavailable_option = boss._c.unavailable_option

      this.make_tool_properties = boss._c.make_tool_properties.bind(this);

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

      this.hnic = boss._c.hnic.bind(this);

      this.soft_apply = boss._c.soft_apply.bind(this);

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
