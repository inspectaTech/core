(function(){
  console.log("blogmodule is running!");
  var app = angular.module("pictureShow");
  app.directive("blogModule",["$window",function($window){
  return{
    restrict:"C",
    templateUrl:function(elem, attr){
      let file_name = attr.marquee
      if(file_name != "blog_module")return;
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
              console.log("btn element detected");
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
      + 'ng-class="{active:take1.responsive == 1}">yes</button>'
      + '<button type="button" class="mSS_stgs_resp w3-btn" ng-click="take1.is_responsive(\'no\')" '
      + 'ng-class="{active:take1.responsive == 0}"  title="if set to \'no\' the slideshow will only be visible on desktops" >no</button>'
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
      type: '@',
      stage: '@'
    },/* to pass in a string you have to do '@' and to pass in an object you have to do '=' */
    link: function(scope, element, attrs){
      console.log("link running!");
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
            el_ctrlr.slick_refresh();
          });
        });
      }//else
    },
    controller:["ShowData","CoStars","$sce","$scope","$timeout",function(ShowData,CoStars,$sce,$scope,$timeout){

      var boss = this;
      this.service = ShowData;
      this._ = ShowData;
      this._c = CoStars;
      if(boss._.tool.file_name != "blog_module")return;

      //var iUN = Math.round(Math.random() * 10000);
      this.iUN = boss._.iUN;

      this.file_name = boss.marquee;
      this.object_params = [];
      this.object_elements = {};
      this.initiated = false;//helps to delay calling elements b4 template is ready
      this.anchors_loaded = false;
      this.init_anchor = false;
      this.dataLoaded = false;
      this.screen_width = ShowData.screen_width;
      this.screen_height = ShowData.screen_height;
      this.responsive = 1;
      this.background = "";
      this.view = "default";
      this.add_view = false;
      this.view_select = `blogMod_view_select_${boss.iUN}`;
      this.section = "basic";
      this.option_section = "options";
      this.front_stage = "";
      var slideIndex = 1;
      this.font_slide_nbr = "";
      this.destination = "";
      this.add_custom = false;
      this._.resize_id = 0;
      this.custom_select = `blogMod_custom_select_${boss.iUN}`;
      this.loader = 0;
      this.loader_el = "blogMod_curtain";
      this.watch_nbr = 0;
      this.device_size = "";

      this.info_space = {
        height_style:0,
		    limit_devices:0,
        design_mode:0,
        custom_type:0
      }

      this.slickConfig = {
        slidesToShow: 3,
        slidesToScroll:3,
        enabled: true,
        event: {
            init: function (event, slick) {
              //slick.slickGoTo($scope.currentIndex); // slide to correct index when init
              //boss.f_resize();
            },
            reInit: function (event, slick) {
              //slick.slickGoTo($scope.currentIndex); // slide to correct index when init
              //boss.f_resize();
            }
        }
      };

      this.proper_properties = [
        "outer","main",
        "content","imagelayer",
        "imagebox","image",
        "textlayer","textbox",
        "title","body",
        "link","button"
      ];


      //console.log("stars = ",this.stars);


      $scope.$watch(function(){return boss.marquee}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
          if(boss._.tool.file_name != "blog_module")return;
        boss.file_name = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss.view}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
          if(boss._.tool.file_name != "blog_module")return;
          boss._.current_view = newValue;
          boss.make_tool_properties();
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.view}, function (newValue, oldValue, scope) {
        if (newValue)

        if(boss._.tool.file_name != "blog_module")return;

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
          if(boss._.tool.file_name != "blog_module")return;
          boss.process_size();
          boss._.resize_id ++;
          //boss.soft_apply();
        }//end if
        //console.log("i see a change in screen_width = ",boss.screen_width);
      }, true);



      $scope.$watch(function(){return boss._.screen_height}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        boss.screen_height = newValue;
        if(boss.initiated == true)
        {
          if(boss._.tool.file_name != "blog_module")return;
          boss.process_size();
        }//end if
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.preview_display}, function (newValue, oldValue, scope) {
        if (newValue){

          if(boss.initiated == true)
          {
            if(boss._.tool.file_name != "blog_module")return;
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
          if(boss._.tool.file_name != "blog_module")return;
        boss.cast = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.tool.views[boss.view].width_pct}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        //boss.cast = newValue;
        if(boss._.tool.file_name != "blog_module")return;
        boss.process_size();
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss._.tool.views[boss.view].auto_width}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        //boss.cast = newValue;
        if(boss._.tool.file_name != "blog_module")return;
        boss.process_size();
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      //do i need this $watch?
      $scope.$watch(function(){return boss._.tool.views[boss.view].sample_class}, function (newValue, oldValue, scope) {
        if (newValue){
          if(boss._.tool.file_name != "blog_module")return;
          //boss.my_stars = newValue;
        //boss.alternate = newValue;
        }
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      //watch for ShowData.tool changes
      $scope.$watch(function(){return boss._.tool}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
          if(boss._.tool.file_name != "blog_module")return;
        boss.tool = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
          boss.process_size();
          //boss.custom_delay();

      }, true);

      $scope.$watch(function(){return boss._.tool.views[boss.view]}, function (newValue, oldValue, scope) {
        if (newValue){
          if(boss._.tool.file_name != "blog_module")return;
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

        boss.update_view()
        .catch(function(err){
          //console.log('not on my watch')
        });


        if(boss._.tool.notes == undefined)
        {
          boss._.tool.notes = "";
        }//if

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

        if(boss.mode == "site" && boss.motiv != "settings"){
          await boss.getAssets();
        }//if

        $timeout(function(){
           //console.log("post Digest with $timeout");
           boss.initiated = true;
           boss.dataLoaded = true;
           //boss.my_stars = boss.update_assets(ShowData.asset_ids);
           boss.my_stars = ShowData.asset_info;//from
           //if(boss.my_stars.length == 0){  boss.outer_style();}
        },0,true).then(function(){
           //boss.showDivs(slideIndex);
           //late watch
           slideIndex = 1;
           $scope.$watch(function(){return boss._.tool.views[boss.view].width}, function (newValue, oldValue, scope) {
             if (newValue)
              if(boss._.tool.file_name != "blog_module")return;
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
              if(boss._.tool.file_name != "blog_module")return;
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
              if(boss._.tool.file_name != "blog_module")return;
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


           window.dispatchEvent(new Event('resize'));

        });//end .then() of $timeout

        return;

      };//$oninit

      this.$postLink = async function ()
      {
        console.log("postLink firing!");
      }// $postLink


      this.getAssets = boss._c.getAssets.bind(this);


      this.update_assets = boss._c.update_assets.bind(this);

      this.insertCanvas = function(dt,lst,tIUN)
      {
        //unique
        if(boss._.tool.file_name != "blog_module")return;

        var inObj = dt;
        let restrict_id = "canvas_img_" + boss.iUN + "_" + inObj.id;
        if(document.querySelector("." + restrict_id) && ShowData.refresh_tool == "false") return;

        let obj_params = JSON.parse(inObj.params);

        let params_str = "params" + inObj.id;
        let last_el = lst;

        // i didn't want to do numbers and create gap indexes so i used a multidim array
        boss.object_params[params_str] = obj_params;
        let obj_str = "bm_canvas_" + boss.iUN + "_"  + inObj.id;
        let asset_id = "blogMod_img_" + boss.iUN + "_" + inObj.id;//custom id
        let addClass = " " + restrict_id + " blogMod asset darken ";//d3-w80 d3-h30
        boss.canvas_mkr({name:obj_str,params:obj_params,home:asset_id,class:addClass,adjust:true});

        //console.log("asset_id = ",asset_id);

        if(ShowData.refresh_tool != "false" && last_el == true){
          //if its the last one reset the container & tell it to close;

          boss.outer_style();

          ShowData.refresh_tool = "close";
        }//end if boss
        //console.log("insert data = ",dt);
      }//insertCanvas

      this.outer_array = [
        "d3_","d3S_","d3M_",
        "d3L_","d3XL_","nav_blog",
        "h_nav","v_nav","clamp",
        "d3_pw","d3_pmw",
        "d3_hide_small","d3_hide_medium",
        "d3_hide_large","invisible"
      ];
      //let scrap = boss.weedOut(chk_str,boss.outer_array,queryStr);

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

        let use_style = (boss.mode == "admin") ? parseInt(ShowData.tool.views[boss.view].samp_h_nbr) + "vw": parseInt(ShowData.tool.views[boss.view].h_nbr) + "vw";
        //boss_cont.style.minHeight = use_style;

        if(is_responsive != 1)return;

        let add_class = (boss.mode == "admin" && boss._.preview_display != "max") ? ShowData.tool.views[boss.view].sample_class: ShowData.tool.views[boss.view].custom_class;
        add_ary = add_class.split(" ");
        boss_cont.className = boss._.clear_redundacy(boss_cont.className,add_ary);
        let use_class = add_class;// speghetti code ment to erase redundancies in custom_class
        //limit/hide on devices

        let hide_small = (boss._.tool.views[boss.view].hide_small == true) ? " d3_hide_small " : "";
        let hide_medium = (boss._.tool.views[boss.view].hide_medium == true) ? " d3_hide_medium " : "";
        let hide_large = (boss._.tool.views[boss.view].hide_large == true) ? " d3_hide_large " : "";

        //restrict action to site/client side display
        let device_limits = (boss.mode != "admin" && boss._.tool.views[boss.view].limit_devices == true) ? ` ${hide_small} ${hide_medium} ${hide_large} ` : "";

        let invisible = (boss.mode != "admin" && boss._.tool.views[boss.view].invisible == true) ? " invisible " : "";

        let adv_class = boss._.tool.views[boss.view].outer.advanced_class;
        boss_cont.className = boss._.clear_redundacy(boss_cont.className,adv_class);

        //nav section
        let nav_class = (boss._.tool.views[boss.view].navigation == true) ? "nav_blog": "";
        let orient = (nav_class == "nav_blog" && boss._.tool.views[boss.view].orientation == "default") ? "h_nav" :
        (nav_class == "nav_blog" && boss._.tool.views[boss.view].orientation != "default") ? "v_nav" : "";
        let navigation = ` ${nav_class} ${orient} `
        navigation = ShowData.removeSomething(navigation,' ');

        boss_cont.className = boss._.clear_redundacy(boss_cont.className,[use_class,device_limits,invisible,navigation]);
        let newClass = ` ${boss_cont.className} ${use_class} ${device_limits} ${invisible} ${navigation} ${adv_class}`;

        boss_cont.className = ShowData.removeSomething(newClass,' ');

        let nav_height = "";
        if(boss._.tool.views[boss.view].navigation == true){
          //let base_font = boss.get_base_font();
          let px_to_rem = ShowData.tool.views[boss.view].px_to_rem || false;
          /*nav_height = (px_to_rem) ? ` min-height:${boss.px_to_rem(ShowData.tool.views[boss.view].height)}rem; ` :
          ` min-height:${ShowData.tool.views[boss.view].height}px; `;*/
          //nav_height = ` height:${ShowData.tool.views[boss.view].height/base_font}rem; `;
          let mesee = "what";
        }


        let out_style = boss.style_obj('outer');//prep_nav_style   //**diff
        boss_cont.style = `${nav_height} ${out_style}`;
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

        //boss.soft_apply();

      }//outer_style


      this.getParam = boss._c.getParam.bind(this);

      this.getClass = function(str,cTxt)
      {
        // unique
        let use_class = "";
        let type = (str.match(/custom\d+/g)) ? "custom" : str;
        let target_detail = ShowData.tool.views[boss.view][str];
        let advanced_class = "";
        let stopper = "textbox";

        switch (type) {
          case "outer":
            use_class = (boss.mode == "admin") ? ShowData.tool.views[boss.view].sample_class: ShowData.tool.views[boss.view].custom_class;

          case "main":
          case "content":
          case "custom":
          case "title":
          case "body":
          case "button":
          case "imagebox":
          case "imagelayer":
          case "textbox":
          case "textlayer":
          case "outer":
          case "image":

          if( ShowData.tool.views[boss.view][str] == undefined)return "";

          if(type == stopper)
          {
            let meseek = type;
          }

          let has_width = (type == "imagebox" || type == "imagelayer" ||
           type == "textbox" || type == "textlayer" || type == "custom") ? "true" : "false";
          let has_width_control = (target_detail.width_control != undefined && target_detail.width_control != false && target_detail.width_control != "disable" ) ? true : false;

          let no_device_width = (target_detail.width_control == undefined ||
          target_detail.width_control != undefined && target_detail.width_control != "device") ? true : false;

          //use_class = ` ${target_detail.custom_class} `;
          let nv_cls = target_detail.nav_class || "";
            use_class = (str == 'content' && ShowData.tool.views[boss.view].navigation) ? `${use_class} ${nv_cls} `
            : `${use_class} ${target_detail.custom_class} `;

            advanced_class = (boss._.exists(target_detail.advanced_class)) ?
            target_detail.advanced_class : "";

            use_class = `${use_class} ${advanced_class}`;

            if(type == 'main' && ShowData.tool.views[boss.view].navigation){
              let nav_dir = (ShowData.tool.views[boss.view].orientation == "default") ? "h_nav" : "v_nav";
              let device_size = boss.get_device_size();
              let flow = (nav_dir == "v_nav") ? "col_no" : (device_size == "small") ? "col_wr" : "row_no";

              use_class =  `${use_class} ${nav_dir} ${flow}`;
            }//if

            //try to catch legacy code before i was using width_control for this
            if(target_detail.device_value && target_detail.width_control == undefined ||
            target_detail.device_value && !no_device_width )
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

            use_class = (target_detail.ellipsis === true) ? `${use_class} clamp ` : use_class;
            // 1st condition is for legacy code
            use_class = (target_detail.width_control == undefined && has_width === "true" && target_detail.width_pct != undefined /*&& no_device_width*/) ?
            ` ${use_class} d3_pw${target_detail.width_pct} ` :
            (has_width_control && has_width === "true" && target_detail.width_pct != undefined /*&& no_device_width*/) ?
            ` ${use_class} d3_pw${target_detail.width_pct} ` : use_class;

            use_class = (boss._.exists(target_detail.card_styling) && target_detail.card_styling != false) ? `${use_class} w3-card ` : use_class;
            use_class = ShowData.removeSomething(use_class," ");

            if(type == stopper)
            {
              let meseek = type;
            }

          break;

          case "link":
            //use_class = (ShowData.tool.views[boss.view].link.shadow_mode === true) ? ` ${ShowData.tool.views[boss.view].link.shadow} ` : "";

            advanced_class = (boss._.exists(target_detail.advanced_class)) ?
            target_detail.advanced_class : "";

            use_class = `${use_class} ${advanced_class}`;
            use_class = (target_detail.active_width === true) ? `${use_class} d3_pmw${target_detail.width_pct} ` : use_class ;
            use_class = `${use_class} ${target_detail.custom_class} `;
            use_class = (target_detail.card_styling != false) ? `${use_class} w3-card ` : use_class;
            use_class = ShowData.removeSomething(use_class," ");
          break;

          case "image_table":

            let alt = "image";
            advanced_class = (boss._.exists(target_detail) && boss._.exists(target_detail.advanced_class)) ?
            target_detail.advanced_class : "";

            use_class = `${use_class} ${advanced_class}`;
            //use_class = (target_detail.shadow_mode === true) ? ` ${target_detail.shadow} ` : "";
            use_class = `${use_class} imalign_${ShowData.tool.views[boss.view][alt].align ||  'center'} `;
            use_class = ShowData.removeSomething(use_class," ");
            //use_class = ShowData.removeSomething(use_class," ");
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

      this.getMainHeight = function()
      {
        // exclusive
        //let use_style = (boss.mode == "admin") ? ShowData.tool.views[boss.view].samp_h_nbr: ShowData.tool.views[boss.view].h_nbr;
        if(ShowData.tool.views[boss.view].height_style != 'strict') return;
        //return `min-height:${ShowData.tool.views[boss.view].height}px;`;
        let px_to_rem = ShowData.tool.views[boss.view].px_to_rem || false;

        return (px_to_rem) ?
        `height:${boss.px_to_rem(ShowData.tool.views[boss.view].height)}rem;` : `height:${ShowData.tool.views[boss.view].height}px;`;
      }//getMainHeight

      this.getStyle = function()
      {
        // unique
        let use_style = (boss.mode == "admin") ? ShowData.tool.views[boss.view].samp_h_nbr: ShowData.tool.views[boss.view].h_nbr;

        //return `min-height:${ShowData.tool.views[boss.view].height}px;`;
        return (ShowData.tool.views[boss.view].height_style == 'strict') ?
        `height:${ShowData.tool.views[boss.view].height}${ShowData.tool.views[boss.view].measure || "px"};` : "";
      }//getStyle

      this.get_adv_design = boss._c.get_adv_design.bind(this);

      this.prep_nav_style = function(dest)
      {
        //exclusive
        //nav hack, if nav mode change the measure to px
        if(boss._.tool.views[boss.view][dest] == undefined)return "";

        let nv_stl = boss.nav_style_obj(dest);
        let stl = boss.style_obj(dest);

        return (ShowData.tool.views[boss.view].navigation) ? `${nv_stl}` :
         `${stl}`;

      }//prep_nav_style

      this.nav_style_obj = function(dest)
      {
        //exclusive
        return (boss._.tool.views[boss.view][dest] != undefined &&
          boss._.tool.views[boss.view][dest].nav_style != undefined) ? boss._.tool.views[boss.view][dest].nav_style : "";
      }

      this.style_obj = function(dest)
      {
        // exclusive
        return (boss._.tool.views[boss.view][dest] != undefined &&
        boss._.tool.views[boss.view][dest].style != undefined) ? boss._.tool.views[boss.view][dest].style : "";
      }



      this.style_hub = function(dest)
      {
        // exclusive
        let main_style = (ShowData.tool.views[boss.view].navigation) ?
        boss.get_nav_style(dest) : boss.tool.views[boss.view][dest].style;
        let alt_style = (dest == "content") ? boss.getStyle() : "";

        //return

      }//style_hub

      this.slide_animate = function(dir)
      {

      }//slide_animate

      this.get_nav_style = function(str,get,eName)
      {
        // exclusive
        if(ShowData.tool.views[boss.view].navigation != true)return;

        let orient = boss._.tool.views[boss.view].orientation;
        let content_str = `blogMod_item_${boss.iUN}`;
        let content_ary = document.querySelectorAll(`.${content_str}`);
        if(!content_ary || content_ary.length < 1)return;
        let current_el = content_ary[0];
        let main_cont = current_el.parentNode;
        let horz_targ = boss._.true_target(current_el,"blogMod_main","className");
        //let view_cont = (orient == "default") ? horz_targ : main_cont.parentNode;
        let view_cont = horz_targ;
        let screen_width = document.body.clientWidth;
        let screen_height = document.body.clientHeight;
        let device_size = boss.get_device_size();
        let full_height = ShowData.tool.views[boss.view].height;
        let mod_height = boss.get_modified_height();
        let px_to_rem = ShowData.tool.views[boss.view].px_to_rem || false;

        //let base_font = boss.get_base_font();//this will equal to 1 rem

        //small and large devices will be treated the same.  medium is the exception
        //leave a note for nav mode column number i just want s m l
        let view_cont_w = view_cont.offsetWidth;
        let view_cont_h = view_cont.offsetHeight;
        //console.log("view cont width = ",view_cont.offsetWidth);
        let w_calc, col_nbr, col_width,l_marg,r_marg,t_pad,b_pad,t_marg,b_marg;

        switch (str) {
          case "main":

          break;
          case "content":
            col_nbr = boss._.tool.views[boss.view].content[`column_${device_size}`];

            /*width is calculated using the width of the view_cont or a division of the
            total width based on the number of elements that will be displayed */
            w_calc = (orient == 'default') ?
            view_cont_w / col_nbr : view_cont_w;
            //h_calc = (orient == 'default') ? mod_height : mod_height / col_nbr;
            h_calc = ShowData.tool.views[boss.view].height;
            //console.log("h_calc = ",h_calc);

            l_marg = boss._.tool.views[boss.view].content.margin_left || 0;
            r_marg = boss._.tool.views[boss.view].content.margin_right || 0;
            t_marg = boss._.tool.views[boss.view].content.margin_top || 0;
            b_marg = boss._.tool.views[boss.view].content.margin_bottom || 0;


            t_pad = boss._.tool.views[boss.view].main.padding_top || 0;
            b_pad = boss._.tool.views[boss.view].main.padding_bottom || 0;

            w_calc = w_calc - (l_marg + r_marg);
            //in vert mode im not worried about the padding. in horz mode maybe
            //h_calc = h_calc - (t_pad + b_pad + t_marg + b_marg);
            h_calc = h_calc - (t_marg + b_marg);
            let vp_w = w_calc / screen_width;
            let vp_h = h_calc / screen_height;
            col_width = (px_to_rem) ? ` width:${boss.px_to_rem(w_calc)}rem; ` : ` width:${w_calc}px; `;
            //col_width = ` width:${w_calc/base_font}rem; `;//
            //col_width = ` width:${vp_w * 100}vw; `;
            col_height = (px_to_rem) ? ` height:${boss.px_to_rem(h_calc)}rem; ` :  ` height:${h_calc}px; `;
            //col_height = ` height:19.21rem; `;
            //col_height = ` height:${h_calc/base_font}rem; `;
            //col_height = ` height:${vp_h * 100}vh; `;

            // why am i not using column heights? - all that height calculating throws all the slick measurements off
            return col_width //+ col_height;
          break;
          case "button":
            //button with and height will switch depending on orientation. - horiz is default
            //let targ_height = (boss.tool.views[boss.view].button.wrap_dots == "yes") ?
            //full_height : mod_height;
            let targ_height = view_cont_h;
            h_calc = (orient == 'default') ?
            targ_height * (boss._.tool.views[boss.view].button.height / 100) :
            boss._.tool.views[boss.view].button.width;//mod_height

            w_calc = (orient == 'default') ? boss._.tool.views[boss.view].button.width :
            view_cont_w * (boss._.tool.views[boss.view].button.height / 100);

            l_marg = boss._.tool.views[boss.view].button.margin_left || 0;
            r_marg = boss._.tool.views[boss.view].button.margin_right || 0;
            t_marg = boss._.tool.views[boss.view].button.margin_top || 0;
            b_marg = boss._.tool.views[boss.view].button.margin_bottom || 0;

            w_calc = w_calc - (l_marg + r_marg);
            h_calc = h_calc - (t_marg + b_marg);

            //col_width = ` width:${w_calc}px; `;
            //col_height = ` height:${h_calc}px; `;
            col_width = (orient == 'default') ? ` width:${boss._.tool.views[boss.view].button.width}px; ` :
            ` width:${w_calc}px; `;
            col_height = (orient == 'default') ? ` height:${h_calc}px; ` :
            ` height:${boss._.tool.views[boss.view].button.width}px; `;

            //put the parts back together to get a true w/h measurement - for the outer style
            boss._.tool.views[boss.view].button.outer_measure = (orient == 'default') ?
            w_calc + (l_marg + r_marg) : h_calc + (t_marg + b_marg);

            return col_width + col_height;

          break;
        }//switch

        let mesee = "what";
      }//get_nav_style

      this.px_to_rem = function(nbr)
      {
        //exclusive
        //get screen width
        let screen_width = document.body.clientWidth;//1124px

        //get 1% of screen width
        let view_width = boss.v_units();

        // get the unit of measurement the actual view width in px should be broken up into
        // where 1 view unit should be x pixels ex. 1.8% of 525px which would be 525 * .0185
        // or one view unit will be 9.71px
        let v_unit = screen_width * view_width;//.014;//11.24px

        //figure out rem measurement for the desired elements px height
        let px_nbr = nbr;//get the px height/width property passed in as a parameter

        let rem_nbr = px_nbr / v_unit;// how many rem view units can i fit into the px nbr?
        rem_nbr = +rem_nbr.toFixed(3);
        let meseeks = rem_nbr;

        return rem_nbr;

      }//px_to_rem


      this.view_widths = [
        {min:0,max:299,view:5.0},
        {min:300,max:479,view:3.9},
        {min:480,max:768,view:1.8},
        {min:769,max:992,view:1.5},
        {min:993,max:1239,view:1.4},
        {min:1240,max:1343,view:1.25},
        {min:1344,max:1468,view:1.15},
        {min:1469,view:1.0}
      ];//used with v_units

      this.v_units = function()
      {
        // exclusive
        let screen_width = document.body.clientWidth;
        let view_units = 0;
        let max_nbr = boss.view_widths.length -1;
        for(let i = 0; i < boss.view_widths.length; i++)
        {
          switch(i){
            case 0:
              if(screen_width >= boss.view_widths[i].min && screen_width <= boss.view_widths[i].max)
              {
                view_units = boss.view_widths[i].view;
              }
            break;
            case max_nbr:
              if(screen_width  >= boss.view_widths[i].min)
              {
                view_units = boss.view_widths[i].view;
              }
            break;
            default:
            if(screen_width >= boss.view_widths[i].min && screen_width <= boss.view_widths[i].max)
            {
              view_units = boss.view_widths[i].view;
            }
          }//switch
          //if(view_units !== 0)break;
        }
        let modifier = .0005;// the modifier tacks on an extra half percent - seems to make it a little more robust?
        view_units = (view_units / 100) + modifier;//im not sure the modifier is doing anything.
        view_units = +view_units.toFixed(5);
        let meseeks = view_units;
        return view_units;
      }//v_units

      this.get_base_font = function()
      {
        //deprecated use v_units
        // exclusive
        let screen_width = document.body.clientWidth;
        let screen_height = document.body.clientHeight;

        let view_min = (screen_width < screen_height) ? screen_width : screen_height;
        let v_p_calc = 2.8;//this is set in the psmod body - its static for the page w/o conflict
        let base_font = view_min * .028;//this will equal to 1 rem

        return base_font;
      }//get_base_font

      this.get_modified_height = function()
      {
        // exclusive
        let orient = boss._.tool.views[boss.view].orientation;
        let height = ShowData.tool.views[boss.view].height;
        let t_marg = boss._.tool.views[boss.view].button.margin_top || 0;
        let b_marg = boss._.tool.views[boss.view].button.margin_bottom || 0;
        let btn_height = boss._.tool.views[boss.view].button.width;//uses the width on vertical
        let active_btn = boss._.tool.views[boss.view].button.active_button;
        let active_dots = boss._.tool.views[boss.view].button.nav_dots;
        let btn_offset = (orient != "default" && active_btn) ? parseInt(btn_height) + 5 +  parseInt(t_marg) +  parseInt(b_marg) : 0
        btn_offset = btn_offset * 2;
        let dot_offset = (active_dots) ? 50 : 0;

        return height - (btn_offset + dot_offset);
      }

      this.f_resize = function()
      {
        // exclusive
        window.dispatchEvent(new Event('resize'));
      }//f_resize

      this.clone_main = function(lst)
      {
        // exclusive
        if(!boss._.tool.views[boss.view].navigation)return;
        if(!lst)return;

        let main_str = ".blogMod_main_" + boss.iUN;
        //let targ_node = document.querySelector(main_str);

        //boss._.main_clone = targ_node.cloneNode(true);

        $(main_str).slick({
        });

      }//clone_main

      this.check_strict = function()
      {
        //exclusive
        if(boss.tool.views[boss.view].navigation){boss.tool.views[boss.view].height_style = 'strict'}
      }//check_strict

      this.nav_measure = function(dest,prop,ms)
      {
        //exclusive
        boss._.tool.views[boss.view][dest][prop] = (boss._.tool.views[boss.view].navigation) ? "px" : ms;
        boss.form_item_style(dest);
      }//nav_measure


      this.getStyle_OG = function()
      {
        let use_style = (boss.mode == "admin") ? ShowData.tool.views[boss.view].samp_h_nbr: ShowData.tool.views[boss.view].h_nbr;

        return `min-height:${use_style}vw;`;
      }//getStyle_OG

      this.weedOut = boss._c.weedOut.bind(this);


      this.setLinkHover = boss._c.setLinkHover.bind(this);

      this.setElementHover = function(eID,dest,c_dest,cls)
      {
        // exclusive
        //if hover is true
        let targ_str = `.${eID}`;
        let targ_el = document.querySelector(targ_str);
        if(!targ_el) return;
        let xClass = (boss._.exists(cls)) ? cls : "none";

        let targ_child = targ_el.querySelector(".textbox");

        if(boss._.exists(boss._.tool.views[boss.view][dest].hide_show) && boss._.tool.views[boss.view][dest].hide_show == true && !targ_child)
        {
            return;
        }
        else if(boss._.exists(boss._.tool.views[boss.view][dest].hide_show) && boss._.tool.views[boss.view][dest].hide_show == true && targ_child)
        {
          targ_child.style.display = "none";
        }//if

        //check for hover existence && hover permission
        if(boss._.exists(boss._.tool.views[boss.view][dest].active_hover) == false ||
        boss._.tool.views[boss.view][dest].active_hover == false) return;

        targ_el.addEventListener("mouseenter",function(){

          targ_el.style.backgroundColor = `${boss._.tool.views[boss.view][dest].bg_hov_hex}`;
          if(boss._.exists(boss._.tool.views[boss.view][dest].font_hov_color))
          {
            targ_el.style.color = `${boss._.tool.views[boss.view][dest].font_hov_color}`;
          }
          if(boss._.exists(boss._.tool.views[boss.view][dest].hide_show) && boss._.tool.views[boss.view][dest].hide_show == true && targ_child)
          {
            targ_child.style.display = boss._.tool.views[boss.view][c_dest].display//child_display;
            let meseeks = targ_child.style.display;
          }

          if(xClass != "none")
          {
            angular.element(targ_el).addClass(xClass);
          }//if
        });

        targ_el.addEventListener("mouseleave",function(){
          targ_el.style.backgroundColor = `${boss._.tool.views[boss.view][dest].bg_hex}`;

          if(boss._.exists(boss._.tool.views[boss.view][dest].font_color))
          {
            targ_el.style.color = `${boss._.tool.views[boss.view][dest].font_color}`;
          }
          if(boss._.exists(boss._.tool.views[boss.view][dest].hide_show) && boss._.tool.views[boss.view][dest].hide_show == true && targ_child)
          {
            targ_child.style.display = "none";
          }

          if(xClass != "none")
          {
            angular.element(targ_el).removeClass(xClass);
          }//if
        });
      }//setElementHover

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
        //can_class += " " + use_class + " ";
        can_class = ShowData.removeSomething(can_class,' ');
        let can_name = cObj.name;//variable name
        let adjust = cObj.adjust || false;
        let has_ellipsis = boss._.tool.views[boss.view].image.ellipsis || false;
        let force_portrait = boss._.tool.views[boss.view].image.force_portrait || false;
        //let has_portrait = force_portrait;
        force_portrait = force_portrait.toString();//

        if(adjust != false){
          can_class += (parseInt(can_w) <= parseInt(can_h) || force_portrait == "true") ? " portrait " : "";
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

      this.plusDivs = boss._c.plusDivs.bind(this);

      this.showDivs = boss._c.showDivs.bind(this);

      this.process_size = boss._c.process_size.bind(this);


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


      this.get_ratio = boss._c.get_ratio.bind(this);

      this.rounded = boss._c.rounded.bind(this);

      this.prep_color = boss._c.prep_color.bind(this);

      //hack for color.ctrlr.js
      this.prep_color2 = boss._c.prep_color2.bind(this);

      this.prep_height = boss._c.prep_height.bind(this);

      this.form_btn_height = boss._c.form_btn_height.bind(this);

      this.form_item_color = function(dat,mod,dest,pref)
      {
        // unique

        let pfx = pref || "bg";
        let base16_str = pfx + "_base16";
        let hex_str = pfx + "_hex";
        let color_str = pfx + "_color";

        switch(mod)
        {
            case "opacity":
              let nbr = dat || 100;//0 - 100
              let pct = parseInt(dat,10) / 100;
              let targ_nbr = (Math.floor(255 * pct)).toString(16);
              targ_nbr = (targ_nbr.length == 1) ? "0" + targ_nbr : targ_nbr;

              boss._.tool.views[boss.view][dest][`${pfx}_base16`] = targ_nbr;
              boss._.tool.views[boss.view][dest][`${pfx}_hex`] = `${boss._.tool.views[boss.view][dest][`${pfx}_color`]}${targ_nbr}`;
              //boss._.tool.views[boss.view].btn_opacity = parseInt(dat,10);
            break;

            case "color":

            let b_16 = (boss._.tool.views[boss.view][dest][`${pfx}_base16`] == undefined ||
            boss._.tool.views[boss.view][dest][`${pfx}_base16`]  == "NaN") ? "ff" : boss._.tool.views[boss.view][dest][`${pfx}_base16`];
              boss._.tool.views[boss.view][dest][`${pfx}_hex`] = `${dat}${b_16}`;
              boss._.tool.views[boss.view][dest][`${pfx}_color`] = dat;

              let hVal = `hex value = ${boss._.tool.views[boss.view][dest][`${pfx}_hex`]}`
              let mesee  = hVal;
              //console.log(hVal);
            break;

            /*case "text":
              boss._.tool.views[boss.view][dest][`${pref}_color`] = dat;
            break;*/
        }//end switch
      }//form_item_color

      this.form_item_style = function(dest)
      {
        //unique
            //let width = `width:${boss._.tool.views[boss.view].width_pct}%;`;
            let ready_custom = (boss.destination == undefined || boss.destination == "") ? "false" : "true";
            if(dest == "custom" && ready_custom == "false")return;

            let target_detail = boss._.tool.views[boss.view][dest];
            let display = (target_detail.display != undefined && target_detail.display != "") ?
            `display:${target_detail.display};` : "";
            let width = "";
            let height_ctrl = boss._.tool.views[boss.view][dest].height_control || false;
            let height = "";
            let txt_color = "";
            let bg_color = `background-color:${target_detail.bg_hex};`;
            let margin = "";
            let padding = "";
            let margin_measure = target_detail.margin_measure || "rem";
            let padding_measure = target_detail.padding_measure || "rem";
            //no need to manipulate the _measure variable - nav_style does it below

            let m_top = (target_detail.margin_top != undefined && target_detail.margin_top != "") ?
            target_detail.margin_top : 0;

            let auto_margins = (boss.exists(target_detail.auto_margins) && target_detail.auto_margins == true) ? true : false;
            let m_lft = (dest == "outer" && target_detail.margin_left == target_detail.margin_right || auto_margins) ?
            " auto " : ` ${target_detail.margin_left || 0}${margin_measure} `;
            let m_rgt = (dest == "outer" && target_detail.margin_left == target_detail.margin_right || auto_margins) ?
            " auto " : ` ${target_detail.margin_right || 0}${margin_measure} `;
            let m_bot = (target_detail.margin_bottom != undefined && target_detail.margin_bottom != "") ?
            target_detail.margin_bottom : 0;

              margin = ["margin: ",`${m_top}${margin_measure} `,
              m_rgt,
              `${m_bot}${margin_measure} `,
              m_lft,`; `].join("");

              let p_top = (target_detail.padding_top != undefined && target_detail.padding_top != "") ?
              target_detail.padding_top : 0;
              let p_rgt = (target_detail.padding_right != undefined && target_detail.padding_right != "") ?
              target_detail.padding_right : 0;
              let p_bot = (target_detail.padding_bottom != undefined && target_detail.padding_bottom != "") ?
              target_detail.padding_bottom : 0;
              let p_lft = (target_detail.padding_left != undefined && target_detail.padding_left != "") ?
              target_detail.padding_left : 0;

              padding = ["padding: ",`${p_top}${padding_measure} `,
              `${p_rgt}${padding_measure} `,
              `${p_bot}${padding_measure} `,
              `${p_lft}${padding_measure} `,`; `].join("");

            if(dest == "link"){

              margin_calc = target_detail.margin_top + target_detail.margin_bottom;

              padding_calc = target_detail.padding_top + target_detail.padding_bottom;

              target_detail.outer_calc = margin_calc + padding_calc;

            }

            let justify = (target_detail.justify != undefined && target_detail.justify != "") ?
            ` justify-content:${target_detail.justify}; ` : "";

            let align = (target_detail.align != undefined && target_detail.align != "") ?
            ` align-items:${target_detail.align}; ` : "";

            let flow = (target_detail.flow != undefined && target_detail.flow != "") ?
            ` flex-flow:${target_detail.flow}; ` : "";


            let border_style = "";
            if(target_detail.active_border == true){
              border_style = `border:${target_detail.border_width}px solid ${target_detail.border_color};`
              + ` border-radius:${target_detail.border_radius}px;`;
            }


            let column = "";

            if(dest == "content")
            {
              let column_width_ary = ["90","90","45","30","22","18","15"];
              let column_size_ary = ["small","medium","large","xlarge"];
              let column_size_obj = {"small":"d3S_pw","medium":"d3M_pw","large":"d3L_pw","xlarge":"d3XL_pw"}
              let col_class = "";
              let flex_class = (target_detail.flex_fill === true) ? "flex_fill" : "";
              let mobile_margin = (target_detail.mobile_margin === true) ? "mobile_m" : "";
              let mobile_padding = (target_detail.mobile_padding === true) ? "mobile_p" : "";

              column_size_ary.forEach(function(entry){

                //process the available column json data and forms a string for responsive column widths
                let size_str = "column_" + entry;
                let size_mkr = (column_width_ary[target_detail[size_str]] != undefined &&
                  column_width_ary[target_detail[size_str]] != "") ?
                  column_width_ary[target_detail[size_str]] : "90";
                  let me_seeks_size = target_detail;
                  //console.log("me_seeks_size = ",me_seeks_size);

                  col_class += ` ${column_size_obj[entry]}${size_mkr} `;
              });//forEach

              col_class += ` ${flex_class} ${mobile_margin} ${mobile_padding} `;
              let nav_class = ` ${flex_class} ${mobile_margin} ${mobile_padding} `;

              col_class += (height_ctrl == true && boss._.tool.views[boss.view][dest].height_pct != undefined ||
              height_ctrl == "percent" && boss._.tool.views[boss.view][dest].height_pct != undefined ) ?
              ` d3S_ph${boss._.tool.views[boss.view][dest].height_pct} ` : "";

              col_class = ShowData.removeSomething(col_class," ");
              let me_seeks_class = target_detail.custom_class;
              //console.log("me_seeks_class = ",me_seeks_class);


              target_detail.custom_class = col_class;
              target_detail.nav_class = nav_class;

            }else {

              let mobile_margin = (target_detail.mobile_margin === true) ? "mobile_m" : "";
              let mobile_padding = (target_detail.mobile_padding === true) ? "mobile_p" : "";

              let c_class = ` ${mobile_margin} ${mobile_padding} `;

              c_class += (boss._.tool.views[boss.view][dest].width_pct != undefined ) ?
              ` d3S_pw${boss._.tool.views[boss.view][dest].width_pct} ` : "";


              c_class += (height_ctrl == true && boss._.tool.views[boss.view][dest].height_pct != undefined ||
              height_ctrl == "percent" && boss._.tool.views[boss.view][dest].height_pct != undefined ) ?
              ` d3S_ph${boss._.tool.views[boss.view][dest].height_pct} ` : "";

              c_class = ShowData.removeSomething(c_class," ");

              target_detail.custom_class = c_class;
            }

            let overflow = "";
            let has_overflow = (dest == "textbox" || dest == "content") ? true : false;
            overflow = (has_overflow && boss.exists(target_detail.overflow_y)) ? ` overflow-y:${target_detail.overflow_y}; ` : "";

            let advanced_style = (boss._.exists(target_detail.advanced_style)) ?
             target_detail.advanced_style : "";

            let conv_px_to_rem = (boss._.exists(target_detail.px_to_rem) && target_detail.height_measure == "px") ? target_detail.px_to_rem : false;
            let ready_direct = (height_ctrl == "direct" && target_detail.height != undefined && target_detail.height_measure != undefined ) ? true : false;

            height = (ready_direct && conv_px_to_rem == false) ?
            `height:${target_detail.height}${target_detail.height_measure}; ` :
            (ready_direct && conv_px_to_rem == true) ?
             `height:${boss.px_to_rem(target_detail.height)}rem; ` : "";

            target_detail.style = display + width + height + bg_color + margin + border_style
            + padding + txt_color + justify + align + flow + overflow + advanced_style;


            if(dest == "content" || dest == "main" || dest == "button" || dest == "outer"){
              //docs: i create a parallel nav_style - initially blank on lodash transfer
              //when modified outside of nav mode it creates a parallel by replacing margin_measure with 'px'
              //when in nav mode it forces margin_measure to be px and creates a clone for nav_mode

              //create a nav style
              let nav_margin = (dest == "content" || dest == "button") ? ShowData.removeSomething(margin,margin_measure,"px") : margin;//remove and replace all instances of margin_measure
              let nav_padding = (dest == "main") ? ShowData.removeSomething(padding,padding_measure,"px") : padding;
              target_detail.nav_style = display + width + height + bg_color + nav_margin + border_style
              + nav_padding + txt_color + justify + align + flow + overflow + advanced_style;
            }

            if(target_detail.auto_same_paddings != undefined)
            {delete target_detail.auto_same_paddings}

            if(dest.match(/custom\d+/g))
            {
              boss.prep_custom(dest);
            }
        //target_detail.btn_style = "background-color:" + boss._.tool.views[boss.view].btn_hex + " !important;";

          if(dest == "textbox")
          {
            let meseek = dest;
          }

          boss.refresh();
      }//form_item_style

      this.get_device_columns = function(tObj,val)
      {
        // exclusive
        //i need the device size
        let device_size = boss.get_device_size(true);
        //compare the size with a conversion array

        switch (val) {
          case "scroll":
            let scroll_val = (boss._.exists(tObj[`scroll_${device_size}`])) ? tObj[`scroll_${device_size}`] : 1;
            return scroll_val;
            break;
          default:
            let col_val =( boss._.exists(tObj[`column_${device_size}`])) ? tObj[`column_${device_size}`] : 1;
            return col_val;
        }
        //output the converted size data

      }//get_device_columns

      this.make_margin = boss._c.make_margin.bind(this);

      this.make_padding = boss._c.make_padding.bind(this);

      this.make_columns = function(dest,mod,dest2)
      {
        // unique
        let column_str,column_boxes;
        let ready_custom = (boss.destination == undefined || boss.destination == "") ? "false" : "true";
        if(dest == "custom" && ready_custom == "false")return;

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

    this.make_scroll = function(dest,mod,dest2)
    {
      // exclusive
      let scroll_str,scroll_boxes;
      let ready_custom = (boss.destination == undefined || boss.destination == "") ? "false" : "true";
      if(dest == "custom" && ready_custom == "false")return;

      switch (dest) {
      case "all":
      /*
        let mod_str = "." + mod;
        let chkAll = document.querySelector(mod_str);
        scroll_str = `.${dest2}_scroll`;
        scroll_boxes = document.querySelectorAll(scroll_str);

        if(chkAll.checked)
        {
          scroll_boxes.forEach(function(entry){
            entry.checked = true;
          });
          //boss._.tool.views[boss.view][dest].auto_same_scrolls = false;
        }else {
          scroll_boxes.forEach(function(entry){
            entry.checked = false;
          });
          //boss._.tool.views[boss.view][dest].auto_same_scrolls = true;
        }
        */
      break;

      default:
      scroll_str = `.${dest}_scroll_box`;
      scroll_boxes = document.querySelectorAll(scroll_str);
      scroll_boxes.forEach(function(entry){
        if(entry.checked)
        {
          let el_param = entry.dataset.param;
            boss._.tool.views[boss.view][dest][el_param] = boss._.tool.views[boss.view][dest].scroll_value;
        }
      });

      boss.form_item_style(dest);
    }//switch


  }//make_scroll

    this.make_devices = function(dest,mod,dest2)
    {
      //exclusive
      let device_str,device_boxes;
      let ready_dest = (boss.destination == undefined || boss.destination == "") ? "false" : "true";
      if(ready_dest == "false")return;

      switch (mod) {
      case "clear":
        device_str = `.${dest}_device_box`;
        device_boxes = document.querySelectorAll(device_str);
        device_boxes.forEach(function(entry){
          if(entry.checked)
          {
            let el_param = entry.dataset.param;
              boss._.tool.views[boss.view][dest][el_param] = "";
          }
        });
      break;

      default:
      device_str = `.${dest}_device_box`;
      device_boxes = document.querySelectorAll(device_str);
      device_boxes.forEach(function(entry){
        if(entry.checked)
        {
          let el_param = entry.dataset.param;
            boss._.tool.views[boss.view][dest][el_param] = boss._.tool.views[boss.view][dest].device_value;
        }
      });

    }//switch

    boss.form_item_style(dest);

  }//make_devices

    this.getMyColors = function()
    {
      // unique
      let color_array = ['main','content','image','title','body','link'];
      return boss.color_getter(color_array);

    }//getMyColors

    this.color_getter = boss._c.color_getter.bind(this);

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

      let has_font = (src == "image" || src == "link-outer") ? "no" : "yes";
      let font = (has_font != "no") ? prep_font : "";
      let height = "";
      let outer_calc = "";
      let font_size = (has_font != "no" && data.font_size != undefined && data.font_size != "") ? `font-size:${data.font_size}${data.font_measure};` : "";
      let font_color = (has_font != "no" && data.font_color != undefined && data.font_color != "") ? `color:${data.font_color};` : "";

      //sets up text ellipsis
      //let line_height = (data.line_height != undefined && data.line_height != "") ? `line-height:${data.line_height}${data.font_measure};` : "";
      let line_height = (has_font != "no" && data.line_height != undefined && data.line_height != "") ? `line-height:${data.line_height}${data.font_measure};` : "";
        let fSz = (has_font != "no" && data.font_size != undefined && data.font_size != "") ? data.font_size : "none";
        let iHt = (data.item_height != undefined && data.item_height != "") ? data.item_height : "none";
        let lNbr = (data.line_number != undefined && data.line_number != "") ? data.line_number : "none";
        let fMeas = (data.font_measure != undefined && data.font_measure != "") ? data.font_measure : "none";

        let h_Calc = (iHt !== "none" && lNbr !== "none"  && fMeas !== "none") ? iHt * lNbr : "none";
        //let proper_src = (src == "body" || src == "title") ? true : false;
        let proper_src = true;
        //control read more height
        let has_link = (src == "link-outer" && data.active_link != undefined && data.active_link == true && h_Calc !== "none") ? true : false;

        height = (proper_src === true && data.ellipsis === true && h_Calc !== "none") ? `height:${h_Calc}${data.font_measure};` : "";
         if(src == "link-outer")
         {
           outer_calc = (data.outer_calc != undefined && data.outer_calc != "") ? data.outer_calc : 0;
           height = (has_link == true) ? `height:${(h_Calc + outer_calc).toFixed(2)}${data.font_measure};` : "";
         }//if

        let line_number = (data.ellipsis != undefined && data.ellipsis === true && data.line_number != undefined
          && data.line_number != "") ? `-webkit-line-clamp: ${data.line_number};` : "";

          //if its link-outer just give a height
        let txt_style = (has_font == "no") ? height : font + font_size + font_color + line_height + line_number + height;

        if(src == "image"){
          //console.log("src == image");
        }
        return txt_style;

    }//getTextStyle

    this.active_content = async function(action)
    {
      let boss = this;
      let active_title = (boss._.tool.views[boss.view].title.active_title == true) ? true : false;
      let active_body = (boss._.tool.views[boss.view].body.active_body == true) ? true : false;
      let active_link = (boss._.tool.views[boss.view].link.active_link == true) ? true : false;
      let my_param = await boss.getParam(action);

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

      console.trace();
      return (active_title || active_body || active_link) ? true : false;
    }//active_content


      this.is_responsive = boss._c.is_responsive.bind(this);

      this.btn_hover = function(str,cStr,mID)
      {
        // unique
        let btn_txt = (cStr == "left") ? "sTBM_L_Btn" : "sTBM_R_Btn";
        let icon_txt = (cStr == "left") ? "sTBM_L_Icon" : "sTBM_R_Icon";
        let btn_string = "." + btn_txt + mID;
        let icon_string = "." + icon_txt + mID;
        let targ_btn = document.querySelector(btn_string);
        let targ_icon = document.querySelector(icon_string);

        switch(str)
        {
          case "enter":
          let mk_btn_col = ShowData.tool.views[boss.view].button.bg_hov + boss._.tool.views[boss.view].button.bg_base16;
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
        let cont = `.bM_slider_${boss.iUN}`;
        let btn_str = `slick-${dir}`;
        let bigDaddy = document.querySelector(cont);
        let targ_btn = bigDaddy.getElementsByClassName(btn_str)[0];

        targ_btn.click();

      }//slick_click

      this.slick_orient = function()
      {
        // exclusive
        return (boss._.tool.views[boss.view].orientation != "default") ? 'true' : 'false';

      }//slick_orient

      this.slick_fade = boss._c.slick_fade.bind(this);

      this.link = boss._c.link.bind(this);

      this.test_link = boss._c.test_link.bind(this);

      /************    nav section  *************/

      /************    end nav section  *************/

      this.form_reset = boss._c.form_reset.bind(this);


      //this has to run once everything is finished loading so i put it in $onInit
      //this.showDivs(slideIndex);


      this.refresh = function()
      {
        $scope.$digest();

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

      this.meView= function(data,params)
      {

        boss;
        boss._.tool;
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

      this.hnic = boss._c.hnic.bind(this);

      this.soft_apply = function(sAObj)
      {
        // unique
        // callout,prop,ms,bool
        let mili = (sAObj != undefined && sAObj.ms  != undefined) ? sAObj.ms : 0;
        let props = (sAObj != undefined && sAObj.prop  != undefined) ? sAObj.prop : "";
        let p_to;
        let bool_val = (sAObj != undefined && sAObj.bool  != undefined) ? sAObj.bool : true;
        return new Promise(function(resolve, reject) {
          // was true
          p_to = $timeout(function(){},mili,false).then(function(){
            if(sAObj != undefined && sAObj.callout != undefined && sAObj.callout != ""){
              sAObj.callout(sAObj.prop);
              resolve(p_to);
            }else{
              resolve(p_to);
            }
          });
        });
      }//soft_apply

      $scope.safeApply = function(fn) {
        // exclusive
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
          if(fn && (typeof(fn) === 'function')) {
            fn();
          }
        } else {
          this.$apply(fn);
        }
      };

      this.exists = function(item)
      {
        return (item != undefined && item != "") ? true : false;
      }//exists

      this.finally = function(uN)
      {
        //boss.slick_refresh();
        boss.manage_dots(uN);//manage external dot position

      }//finally

      this.manage_dots = function(uN)
      {
        // unique
        let nav = boss._.tool.views[boss.view].navigation || false;
        let active_dots = (boss._.tool.views[boss.view].button != undefined &&
        boss._.tool.views[boss.view].button.nav_dots != undefined &&
        boss._.tool.views[boss.view].button.nav_dots != "") ? boss._.tool.views[boss.view].button.nav_dots : false;

        let iUN = uN;

        if(nav && active_dots)
        {
          let targ_el = document.querySelector(`.bM_slider_${iUN}`);
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
        boss.slick_refresh("once");
        boss.finally(uN);
        //boss.soft_apply(boss.finally,uN)

      }

      this.slick_refresh = function(mod)
      {
        // unique
        let targ_slider = `.bM_slider_${boss.iUN}`;
        let targ_el = document.querySelector(targ_slider);
        let mode = mod || "default"
        if(targ_el == undefined || targ_el.slick == undefined)return;
        targ_el.slick.refresh();
        //targ_el.slick.setPosition();
        //targ_el.slick('resize');
        if(mode == "default"){
          //boss.soft_apply();
        }
      }//slick_refresh


      this.refresh = function()
      {
        $timeout(function(){},0,true);

      }//refresh


      /******  custom section *******/


      this.get_device_size = boss._c.get_device_size.bind(this);

      this.update_view = boss._c.update_view.bind(this);


      this.select_image_ndx = boss._c.select_image_ndx.bind(this);

      this.custom_delay = function()
      {
        //boss.watch_nbr ++;
        boss.soft_apply({"callout":boss.prep_custom});
        return `fin`;
      }//custom_delay

      this.empty_loader = function(lst)
      {
        let mt = boss._.tool.module_title;
        console.log("module title = ",mt);

        // return;// works only with empty items
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
        // boss.after(lst);
        return;
      }//empty_loader

      this.after = function(lst)
      {
        //runs after the assets are loaded
        let mt = boss._.tool.module_title;
        console.log("module title = ",mt);

        if(lst != true)return;

        //run customizations
        //boss.custom_delay();
        // try{
        //   if(boss._.exists(boss._.tool.views.default.custom1.custom_type) &&
        //   boss._.tool.views.default.custom1.custom_type == "nested")
        //   {
        //     console.log(`last for ${boss.file_name} is running`,boss._.tool.views.default);
        //   }
        // }catch(err){}
        boss.prep_custom();

        //if its invisible run outer style
        if(boss._.tool.views[boss.view].invisible == true)
        {
          //boss.process_size();
          boss.outer_style();
        }

        boss.setAnchor();

        return;
      }//after empty_loader2

      this.getBound = function()
      {
        // try{
        //   if(boss._.exists(boss._.tool.views.default.custom1.custom_type) &&
        //  boss._.tool.views.default.custom1.custom_type == "nested")
        //  {
        //     console.log(`bind for ${boss.file_name} is running`,boss._.tool.views.default);
        //  }
        // }catch(err){}
      }

      this.prep_custom = boss._c.prep_custom.bind(this);

      this.getAnchor = function(lObj,str)
      {
        // unique
        if(lObj == undefined)return;

        let anchor = (lObj != undefined && lObj.anchor != undefined) ? lObj.anchor : "";
        let targ_obj = boss._.tool.views[boss.view];
        let active_anchor = targ_obj.active_anchor || false;
        let has_alias = (anchor != "") ? true : false;

        //as soon as lObj is loaded were ready to try to setAnchors
        boss.anchors_loaded = true;
        return (active_anchor && has_alias) ? anchor : `${str}_${boss.iUN}`;
      }//getAnchor

      this.setAnchor = function()
      {
        // exclusive
        //wait til anchors are loaded
        if(boss.initiated != true || boss.anchors_loaded != true)return;

        //run only once
        if(boss.init_anchor == true)return;

        let anchor = location.hash || "";
        let targ_obj = boss._.tool.views[boss.view];
        let active_anchor = targ_obj.active_anchor || false;
        let has_alias = (anchor != "") ? true : false;

        if(active_anchor && has_alias){
          boss.soft_apply()
          .then(function(){
            //it happens before the page is loaded - try a little later with this
            window.location.href = anchor;
          });
        };
        boss.init_anchor = true;

      }//getAnchor

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

              // boss.soft_apply("","",300)
              // .then(function(prms1_to){
              //   $timeout.cancel(prms1_to)
              //   boss.soft_apply()
              //   .then(function(prms2_to){
              //       $timeout.cancel(prms2_to)
              //       boss.delay_nested({t_obj,type,dest})
              //
              //   });
              //
              // });

              // soft_apply is different in blog_module
                boss.soft_apply({"bool":false})
                .then(function(prms2_to){
                    $timeout.cancel(prms2_to)
                    boss.delay_nested({t_obj,type,dest})
                });

                //$$postDigest(boss.delay_nested)

            break;

          }//switch
        //});//promise
      }//process_custom_element

      this.declare_last = boss._c.declare_last.bind(this);

      $scope.$on('repeatDone', function(event,data)
      {

        if(data.toolname != "blogMod" || data.iun != boss.iUN )return;
          console.log('good to go');

          let meseeks = "repeat done";
          boss.after(data.last);
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

      this.setSelect = boss._c.setSelect.bind(this);

      this.setTemplateStyle = function()
      {
        boss._.activate_template(boss._.tool);
      }//setTemplateStyle

      this.template_styles = {};
      this.template_styles.options = bM_temps;
      this.template_styles.label = "basic";

      this.tool_properties = [];

      this.available_option = boss._c.available_option

      this.unavailable_option = boss._c.unavailable_option

      this.make_tool_properties = boss._c.make_tool_properties.bind(this);

      boss.make_tool_properties();

      /******  end dynamic templates *******/


    }],
    controllerAs:"take1",
    bindToController:true
  };
}]);

  // 'file':'readable title'
  var bM_temps = {
        "basic":"basic",
        "basic_nav":"basic nav",
        "layer":"layer",
        "layer_nav":"layer nav",
        "nav":"nav",
        "nav_nav":"slider nav"
      }

})();
