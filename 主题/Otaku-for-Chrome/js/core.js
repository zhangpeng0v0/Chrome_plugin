$(function(){
  var Core = {
    registerWidgetSettingList:function(widgetName,widgetLabel,widgetCurrentLayout){
      //添加到设置面板
      var html = '<div class="widget-item"><label>'+widgetLabel+'</label>';
      html += '<select class="widget-layout" data-widget="'+widgetName+'" data-label="'+widgetLabel+'">';
      if(widgetCurrentLayout == "left"){
        html += '<option value="left" selected="selected">显示在左面板</option><option value="center">显示在中面板</option><option value="right">显示在右面板</option><option value="close">关闭</option>';
      }else if(widgetCurrentLayout == "center"){
        html += '<option value="left">显示在左面板</option><option value="center" selected="selected">显示在中面板</option><option value="right">显示在右面板</option><option value="close">关闭</option>';
      }else if(widgetCurrentLayout == "right"){
        html += '<option value="left">显示在左面板</option><option value="center">显示在中面板</option><option value="right" selected="selected">显示在右面板</option><option value="close">关闭</option>';
      }else{
        //close
        html += '<option value="left">显示在左面板</option><option value="center">显示在中面板</option><option value="right">显示在右面板</option><option value="close" selected="selected">关闭</option>';
      }
      html += '</select></div>';
      $('#settings .widget-list').append(html);
    },
    addWidget:function(widgetName, container){
      if(!container){
        container = $('#center-panel');
      }

      var outer = $('<div class="otk-panel"></div>').appendTo(container);
      var url = "../widgets/" + widgetName + "/index.html";
      $.get(url,function(data,status){
        outer.append(data);
      });
    },
    updateWidgetPanel:function(){
      var widgetLayout = Core.settings.get("widgetLayout");
      if(widgetLayout){
        var leftPanel = $('#left-panel');
        var centerPanel = $('#center-panel');
        var rightPanel = $('#right-panel');

        $.each(widgetLayout,function(index, el){
          var widgetName = el.name;
          var widgetPanel = el.layout;
          var widget = $('#'+widgetName).parent('.otk-panel');
          if(widget.length>0){
            //可用存在
            if(widgetPanel == "left"){
              widget.appendTo(leftPanel);
            }else if(widgetPanel == "center"){
              widget.appendTo(centerPanel);
            }else if(widgetPanel == "right"){
              widget.appendTo(rightPanel);
            }else{
              widget.remove();
            }
          }else{
            //不可用。需重新载入
            if(widgetPanel == "left"){
              Core.addWidget(widgetName,leftPanel);
            }else if(widgetPanel == "center"){
              Core.addWidget(widgetName,centerPanel);
            }else if(widgetPanel == "right"){
              Core.addWidget(widgetName,rightPanel);
            }
          }
        });
      }
    },
    updateLinks:function(){
      var linksSettings = Core.settings.get("links");

      //主面板
      var toolbarLinks = $('#toolbar .links');
      toolbarLinks.html('');
      var html = '';
      for(var i=0;i<linksSettings.length;i++){
        var obj = {
          label:linksSettings[i].label,
          website:linksSettings[i].website
        };
        html += '<a href="'+obj.website+'">'+obj.label+'</a>';
      }
      toolbarLinks.html(html);

      //设置面板
      var settingsLinks = $('#settings .links-list');
      settingsLinks.html('');
      html = '';
      for(var i=0;i<linksSettings.length;i++){
        var obj = {
          label:linksSettings[i].label,
          website:linksSettings[i].website
        };
        html += '<a class="links-item" href="'+obj.website+'">'+obj.label+'<i class="fa fa-close"></i></a>';
      }
      settingsLinks.html(html);
    },
    settings:{
      add:function(key, value){
        var localSetting = localStorage.setting;
        var obj = {};
        if(localSetting){
          obj = JSON.parse(localSetting);
          if("undefined" == typeof obj[key]){
            obj[key] = value;
          }else{
            //该项已存在
          }
        }else{
          obj[key] = value;
        }
        localStorage.setting = JSON.stringify(obj);
      },
      get:function(key){
        var localSetting = localStorage.setting;
        if(localSetting){
          var obj = JSON.parse(localSetting);
          if(typeof obj[key] == "undefined"){
            return ""
          }else{
            return obj[key]
          }
        }else{
          return {};
        }
      },
      set:function(key,value){
        var localSetting = localStorage.setting;
        var obj = {};
        if(localSetting){
          obj = JSON.parse(localSetting);
          obj[key] = value;
        }else{
          obj[key] = value;
        }
        localStorage.setting = JSON.stringify(obj);
      }
    },
    checkUrl:function(url){
      // var RegUrl = new RegExp();
      // RegUrl.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
      // if (!RegUrl.test(str)) {
      //     return false;
      // }
      // return true;
      var domainNameList = [
        ".ac",
        ".top",
        ".com",
        ".cn",
        ".top",
        ".edu",
        ".gov",
        ".mil",
        ".arpa",
        ".net",
        ".org",
        ".biz",
        ".info",
        ".pro",
        ".name",
        ".coop",
        ".aero",
        ".museum",
        ".mobi",
        ".asia",
        ".tel",
        ".int",
        ".cc",
        ".us",
        ".travel",
        ".xxx",
        ".idv"
      ];
      var res = false;
      $.each(domainNameList, function(index, el) {
        if(url.indexOf(el) > 0){
          res = true;
        }
      });
      return res;
    },
    toggleSettings:function(){
      $('#settings').toggleClass('active');
      $('#overlay').toggleClass('active');
    },
    widgetSettings:{
      set:function(widgetName, jsonData){
        widgetName = "widget-" + widgetName;
        var data = jsonData;
        if("object" == typeof data){
          data = JSON.stringify(data);
        }
        localStorage[widgetName] = data
      },
      get:function(widgetName){
        widgetName = "widget-" + widgetName;
        var ls = localStorage[widgetName];
        if(ls){
          return JSON.parse(ls);
        }else{
          return undefined;
        }

      },
      //widgetLabel可以为空
      registerUI:function(widgetName,data,widgetLabel){
        var html = '<div class="content-item" data-menu="'+widgetName+'">';
        var ws = Core.widgetSettings.get(widgetName);
        for(var i=0;i<data.length; i++){
          var item = data[i];
          var itemHtml = '';
          var label = item.label;
          itemHtml += '<label>'+ (label[item.name]?label[item.name]:item.name) +'</label>';
          itemHtml += '<input type="'+item.type+'" data-name="'+item.name+'" value="'+ws[item.name]+'">';
          html += itemHtml;
        }
        html += '</div>';

        $('#settings .menu-list').append('<div class="menu-item" data-menu-name="'+widgetName+'">'+(widgetLabel?widgetLabel:widgetName)+'</div>');
        $('#settings .content').append(html);
      }
    },
    //FileSystem
    getPicBlob:function(url, callback){
      var oReq = new XMLHttpRequest();
      oReq.open("GET", url, true);
      oReq.responseType = "blob";
      oReq.onreadystatechange = function () {
          if (oReq.readyState == oReq.DONE) {
              var blob = oReq.response;
              // console.log(blob);
              // console.log(URL.createObjectURL(blob));
              callback(blob);
          }
      }
      oReq.send();
    },
    /* filePath "/background.jpg"
     *  data {data:blob,type:'image/jpeg'}
     */
    writeFile:function(filePath, data, callback){
      var filer = new Filer();
      filer.init({persistent: true, size: 500 * 1024 * 1024}, function(fs) {
        filer.write(filePath,data, function(fileEntry, fileWriter) {
          // console.log(fileEntry);
          // console.log(fileWriter);
          callback(filer.pathToFilesystemURL(filePath));
        });
      });
    },
    setWallPaper:function(url){
      if(typeof(url) == "string"){
        Core.settings.set("lastWallPaper",url);
        $('#background').css('background-image', 'url('+url+'?'+Math.random()+')');//立即更新
        $('#settings .wallpaper img.thumbnail').attr('src', url+'?'+Math.random());//立即设置缩略图更新
      }
    },
    //壁纸
    randomLoadWallPaper:function(){
      var url = "http://img.infinitynewtab.com/wallpaper/"+ (Math.floor(4050 * Math.random()) + 1) +".jpg";
      // console.log(url);
      Core.getPicBlob(url,function(blob){
        // console.log(blob);
        Core.writeFile("/background.jpg",{data:blob,type:'image/jpeg'},function(localUrl){
          console.log("更换壁纸完毕:"+url);
          Core.setWallPaper(localUrl);
        });
      })
    },
    loadWallPaperByUrl:function(url){
      Core.getPicBlob(url,function(blob){
        // console.log(blob);
        Core.writeFile("/background.jpg",{data:blob,type:'image/jpeg'},function(localUrl){
          console.log("更换壁纸完毕:"+url);
          Core.setWallPaper(localUrl);
        });
      })
    },
    addWebmessage:function(messageContent){
      var html = '<div class="web-message"><div class="web-message-content">'+messageContent+'</div><i class="fa fa-close"></i></div>';
      var dom = $(html);
      dom.appendTo('body');
      setTimeout(function(){
        if(dom){
          dom.addClass('show');
        }
      },0);
      setTimeout(function(){
        if(dom){
          dom.addClass('hide');
        }
      },5000);
      setTimeout(function(){
        if(dom){
          dom.remove();
        }
      },10000);
    }
  };

  window.Core = Core;
});
