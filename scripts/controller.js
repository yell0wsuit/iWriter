var event_type = 'click';
var global_str = "";
var awl_list = "";
var overWrite_flag = false;

var device_detect = false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    event_type = 'touchend';
    device_detect = true;
}

function Controller() {
    //Properties
    this.project_xml_data = new Object();
    this.project_count = 0;
    this.load_count = 0;
    this.current_key;
    this.para_ids = new Array();
    this.event_type = 'click';
    this.config_msg;
    this.xml_img_path = 'images/mitr/xml';
    this.project_short_name = "";
    this.current_tool = '';
    this.show_popup = false;
    this.current_pro_name = '';
    var _this = this;
    //functions
    this.init = function(load_data_arg) {
        //load_data_arg = yes = load all the xml in init else when required
        //_this.xml_file_path = load_data_arg.xmlPath;
        //_this.image_file_path = load_data_arg.imgPath + 'mitr/';
        //_this.xml_img_path = load_data_arg.imgPath + 'mitr/xml/';
        var project_count = 0;
        this.load_data = load_data_arg;
        $.ajax({// to get project list
            type: "GET",
            url: (/academic/.test(location.pathname)) ? "xml/academic/frameworks.xml" : "xml/frameworks.xml",
            dataType: "xml",
            success: function(xml) {
                $(xml).find('framework').each(function() {
                    var project_name = $(this).attr('name');
                    var short_name = $(this).attr('shortname');
                    var file_name = $(this).attr('code') + '.xml';
                    var object_name = $(this).attr('code');
                    _this.project_xml_data[project_count] = {'project_name': project_name, 'file_name': file_name, 'object_name': object_name, 'short_name': short_name};
                    project_count++;
                    _this.project_count = project_count;
                    if (Number($(xml).find('framework').length) === _this.project_count) {
                        _this.loadFramework();
                        var iLoader = document.getElementById('iLoader');
                        $(iLoader).remove();
                    }
                });
            },
            error: function() {
                alert("An error occurred while processing XML file.");
            }
        });
        $.ajax({// to get config
            type: "GET",
            url: (/academic/.test(location.pathname)) ? "xml/academic/config.xml" : "xml/config.xml",
            dataType: "xml",
            success: function(xml) {
                _this.config_msg = xml;
            },
            error: function() {
                alert("An error occurred while processing XML file.");
            }
        });
        $.ajax({ // AWL list
            type: "GET",
            url: "xml/academic/awl_list.json",
            dataType: "json",
            success: function(json) {
                awl_list = json.awl;
            },
            error: function() {
                alert("An error occurred while processing JSON file.");
            }
        });
    };
    this.loadFramework = function() {
        
        $.ajax({
            type: "GET",
            async: false,
            url: (/academic/.test(location.pathname)) ? "xml/academic/frameworks.xml" : "xml/frameworks.xml",
            dataType: "xml",
            success: function(xml) {
                $(xml).find('framework').each(function() {
                    for (var key in _this.project_xml_data) {
                        if (_this.project_xml_data[key]['object_name'] == $(this).attr('code')) {
                            _this.project_xml_data[key]['framework_model'] = $(this).attr('model');
                            _this.project_xml_data[key]['framework_summery'] = $(this).attr('summary');
                            _this.project_xml_data[key]['framework_enabled'] = $(this).attr('enabled');
                        }
                    }
                });
                _this.loadXML();
                //var iLoader = document.getElementById('iLoader');
                //$(iLoader).remove();
            },
            error: function() {
                alert("An error occurred while processing XML file.");
            }
        });
    };
    this.loadXML = function() {
        if (_this.load_count < _this.project_count) {
            $.ajax({
                type: "GET",
                async: false,
                url: (/academic/.test(location.pathname)) ? "xml/academic/" + _this.project_xml_data[_this.load_count]['file_name'] : "xml/" + _this.project_xml_data[_this.load_count]['file_name'],
                dataType: "xml",
                success: function(xml) {
                    _this.project_xml_data[_this.load_count]['xml_data'] = xml;
                    _this.load_count++;
                    _this.loadXML();
                    var iLoader = document.getElementById('iLoader');
                    $(iLoader).remove();
                },
                error: function() {
                    alert("An error occurred while processing XML file.");
                }
            });
            //if ((_this.project_count - _this.load_count) === 1) {
            //this.leftPanelModel('li', '.second_page_body_left ul');
            //}
        }
    };
    this.leftPanelModel = function(element, wrapper) {

        _this.modelInit();
        var project_html = '';
        for (var key in _this.project_xml_data) {
            if (_this.project_xml_data[key]['framework_model'] === 'y' && _this.project_xml_data[key]['framework_enabled'] === 'true') {
                project_html = project_html + '<' + element + ' data-key="' + key + '" class="list-group-item list-group-item-action d-flex"><div class="li_inner"><span class="sp_left" data-key="' + key + '">' + _this.project_xml_data[key]['project_name'] + '</span><span class="info_ic ms-2"></span></div><a href="javascript:void(0)" data-bs-toggle="popover" data-bs-content="'+ _this.project_xml_data[key]['framework_summery'] +'"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16"> <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/> </svg></a>' + '</' + element + '>';
            } else {
                //project_html = project_html + '<' + element + ' data-key="' + key + '"><div style="opacity: 0.3; cursor: default;"class="li_inner_dis"><span class="sp_left_dis" data-key="' + key + '">' + _this.project_xml_data[key]['project_name'] + '</span><span class="info_ic_dis"></span></div><div class="info_text">' + _this.project_xml_data[key]['framework_summery'] + '</div>' + '</' + element + '>';
            }
        }
        //$('.left_menu').hide();
        $('.second_page_body_left').css('left', '0');
        $('.second_page_body_right').empty();
        $(wrapper).empty().append(project_html);
        $('#modelnavbar').html('Choose the model you want to see');
        if (Number($(window).width()) <= 480) {
            $('#modelnavbar').text('Choose a model');
        }
        $('.top_model_menu_text,.models_page_menu_text').html('Models');
        $(".info_ic").each(function(index, element) {

            $(this).attr('data-show', 'hide');
            $(this).bind(event_type, function(e) {
                if ($(window).width() <= 768) {
                    //$(".info_text").hide("blind");
                    //$(this).parent().next().show("blind");
                    $(".info_text").slideUp();
                    //$(".info_ic").css('background-image', 'url("images/mitr/oxford/info_01.svg")');
                    if ($(this).attr('data-show') == 'hide') {
                        $(this).parent().next().slideDown();
                        $(this).attr('data-show', 'show');
                        $(this).css('filter', 'saturate(8)');
                    } else {
                        $(".info_text").slideUp();
                        $(this).attr('data-show', 'hide');
                        $(this).css('filter', 'saturate(1)');
                    }
                }
            });
            $(this).mouseover(function(e) {
                if ($(window).width() > 768) {
                    var pos = $(this).position();
                    $('.arrow_box').html($(this).parents('.li_inner').next().html());
                    $('.arrow_wrp').css('top', pos.top - ($('.arrow_wrp').height() / 2) + 16);
                    $('.arrow_wrp').css('left', pos.left + 36);
                    $('.arrow_wrp').show();
                    $(this).css('filter', 'saturate(8)');
                }
            }).mouseout(function(e) {
                if ($(window).width() > 768) {
                    $('.arrow_wrp').hide();
                    $(this).css('filter', 'saturate(1)');
                }
            });
        });
        $(wrapper + ' .sp_left').off('click').on('click', function(e) {
            _this.current_pro_name = '';
            _this.createModel($(this).html(), $(this).attr('data-key'));

            var scroll_pos = $('.main_wrapper').position();
            $(window).scrollTop(scroll_pos.top);
        });
    };
    this.modelInit = function() {
        //model init
        _this.current_tool = 'model';
        $('.inner_wrapper').css('overflow', 'hidden');
        $('.current_tool').text('My Writing');
        $('.tool_down_arrow').hide();
        _this.reset_drop();
        $('.current_tool').on(event_type, function(e) {

            if ($('.second_page').is(':visible')) {
                $('.fn_rigth').trigger('click');
            } else {
                _this.writerInit();
                if (_this.current_pro_name == '') {
                    _this.create_project(_this.current_key, 'create', '');
                } else {

                    _this.create_project(_this.current_key, 'save', _this.current_pro_name);
                }

            }
        });
        $('.iwriter_t').hide();
        $('.search_title p:last-child').text('Explore the model by showing and hiding different elements');
        $('.top_model_menu_text,.models_page_menu_text').html('Models');
        $('.white_content').hide();
        //end model init
    };
    this.createModel = function(m_name, m_key) {
        _this.reset_drop();
        //e.preventDefault();
        _this.project_short_name = '';
        $('.common_page').hide();
        $('.info_text').hide();
        $('.models_page').show();
        //$('.left_menu').show();
        /*$('.models_page_body_left').css('left', 0);
        if ($(window).width() <= 480) {
            var left_pos = $('.models_page_body_left').position();
            if (Number(left_pos.left) == 0) {
                //$('.models_page_body').css('overflow', 'hidden');
            }
        }*/

        $('.str_common').each(function() {
            $(this).children('.tick_mark').removeClass('_selected');
        });
        $('.models_page_left_panel').html(m_name);
        $('.models_page_body .left_wrapper').empty().html('<div class="steps_title"><p>Guided tour of the model</p><p>Take a step-by-step tour of how the model was written</p></div><div class="medels_steps list-group list-group-flush"></div>');
        $('.models_page_body_left .medels_steps').empty();
        $('.models_header').empty();
        $('.models_content').empty();
        var guided_html = '';
        var parent = this;
        _this.current_key = m_key;
        //check for filter
        var notes_status = false;
        var content_status = false;
        $('.str_common').show();
        _this.project_short_name = _this.project_xml_data[_this.current_key]['short_name'];
        if ($(window).width() <= 768) {
            if (_this.project_short_name != '') {
                $('.models_page_left_panel').html(_this.project_short_name);
            } else {
                $('.models_page_left_panel').parents('.navbar-brand').addClass('w-25');
            }
        }

        $(_this.project_xml_data[_this.current_key]['xml_data']).find('paragraph').each(function() {
            $(this).find('notes').each(function() {
                if ($(this).text().trim() != '') {
                    notes_status = true;
                }
            });
            $(this).find('content').each(function() {
                if ($(this).text().trim() != '') {
                    content_status = true;
                }
            });
        });
        if (!notes_status) {
            $('.show_notes').hide();
        }
        if (!content_status) {
            $('.show_content').hide();
        }
        //end check for filter

        $(_this.project_xml_data[_this.current_key]['xml_data']).find('step').each(function() {
            guided_html = guided_html + '<button data-bs-dismiss="offcanvas" data-key="' + _this.current_key + '" data-para_ids="' + $(this).attr('para_ids') + '" class="list-group-item list-group-item-action"><span data-key="' + _this.current_key + '" data-para_ids="' + $(this).attr('para_ids') + '">' + $(this).attr('label') + '</span></button>';
        });
        $('.models_page_body_left .medels_steps').append(guided_html);
        $('.models_page_body_left .medels_steps button').on('click', function() {

            var scroll_pos = $('.main_wrapper').position();
            $(window).scrollTop(scroll_pos.top);

            _this.reset_drop();
            $('.str_common').each(function() {
                $(this).children('.tick_mark').removeClass('_selected');
            });
            //$('.medels_steps li').removeAttr('style');
            $('.models_page_body_left .medels_steps button').removeClass('active');
            $(this).addClass('active');
            /*var left_pos = $('.models_page_body_left').position();
            if (Number(left_pos.left) == 0) {
                if ($(window).width() <= 480) {
                    $('.models_page_body_left').animate({'left': '-100%'});
                    $('.left_menu').css('background-position', '0px 0px');
                } else {
                    $('.models_page_body_left').animate({'left': '-100%'});
                    $('.left_menu').css('background-position', '0px 0px');
                }
            }*/
            


            var parent_0 = this;
            var top_para = new Array(); //It contains header info.
            var top_para_content = '';
            var para_ids = new Array(); //It contains para ids for body info.
            var body_content = '';
            $('.models_header').empty();
            $('.models_content').empty();
            if ($(this).attr('data-para_ids') === 'undefined') {
                $('.models_content').addClass('d-none');
                $(_this.project_xml_data[_this.current_key]['xml_data']).find('step').each(function() {
                    if ($(this).attr('label') == $(parent_0).children('span').text()) {
                        $(this).children().find('para').each(function(index) {
                            top_para[index] = $(this).text();
                            top_para_content = top_para_content + '<p>' + $(this).text() + '</p>';
                        });
                        $('.models_header').html(top_para_content);
                        
                    }
                });
            } else {
                $('.models_content').removeClass('d-none');
                para_ids = $(parent_0).attr('data-para_ids').toString().split(',');
                for (var i = 0; i < para_ids.length; i++) {
                    para_ids[i] = para_ids[i].split('_');
                    para_ids[i] = para_ids[i][para_ids[i].length - 1];
                    para_ids[i] = para_ids[i].trim();
                    para_ids[i] = parseInt(para_ids[i]);
                }

                para_ids.sort(function(a, b) {
                    return a - b
                });
                var colors = ["#E8BCC1", "#C5DBF4", "#FFF7B4", "#B6CD72", "#F2D4A6", "#DBDED8"];
                var bscolors = ["bg-primary text-bg-primary", "bg-success text-bg-success", "bg-danger text-bg-danger", "bg-warning text-bg-warning", "bg-info text-bg-info", "bg-secondary text-bg-secondary"];
                var colors_cnt = 0;
                $(_this.project_xml_data[_this.current_key]['xml_data']).find('step').each(function() {
                    if ($(this).attr('label') == $(parent_0).children('span').text()) {
                        $(this).children().find('para').each(function(index) {
                            top_para[index] = $(this).text();
                            top_para_content = top_para_content + '<p>' + $(this).text();
                            if ($(this).attr('showme')) {
                                //top_para_content = top_para_content + '<div data-showme="' + $(this).attr('showme') + '"class="show_me_btn"></div>';
                                top_para_content = top_para_content + ' ' + '<input class="show_me_btn form-check-input" data-color="' + bscolors[colors_cnt] + '" data-showme="' + $(this).attr('showme') + '" type="checkbox" name="showme">';
                                colors_cnt++;
                            }
                            top_para_content = top_para_content + '</p>';
                        });
                        $('.models_header').html(top_para_content);
                    }
                });
                $(_this.project_xml_data[_this.current_key]['xml_data']).find('paragraph').each(function() {

                    var tag_status = false;
                    var xml_img = '';
                    if ($(this).find('content').length != 0 || $(this).find('notes').length != 0 || $(this).find('name').length != 0 || $(this).find('desc').length != 0) {

                        var temp_con_n = 0;
                        var temp_notes_n = 0;
                        var temp_name_n = 0;
                        var temp_desc_n = 0;
                        if (typeof ($(this).children('content').attr('eid')) != 'undefined') {
                            temp_con_n = $(this).children('content').attr('eid').split('_');
                            if (typeof ($(this).children('content').attr('image')) != 'undefined') {
                                xml_img = '<img class="img-fluid mb-2 mx-auto d-block" src="' + _this.xml_img_path + '/' + $(this).children('content').attr('image') + '"/>';
                            }
                        }
                        if (typeof ($(this).children('notes').attr('eid')) != 'undefined') {
                            temp_notes_n = $(this).children('notes').attr('eid').split('_');
                        }
                        if (typeof ($(this).children('name').attr('eid')) != 'undefined') {
                            temp_name_n = $(this).children('name').attr('eid').split('_');
                        }
                        if (typeof ($(this).children('desc').attr('eid')) != 'undefined') {
                            temp_desc_n = $(this).children('desc').attr('eid').split('_');
                        }


                        if (para_ids.indexOf(parseInt(temp_con_n[temp_con_n.length - 1])) != (-1)) {
                            tag_status = true;
                        }
                        if (para_ids.indexOf(parseInt(temp_notes_n[temp_notes_n.length - 1])) != (-1)) {
                            tag_status = true;
                        }
                        if (para_ids.indexOf(parseInt(temp_name_n[temp_name_n.length - 1])) != (-1)) {
                            tag_status = true;
                        }
                        if (para_ids.indexOf(parseInt(temp_desc_n[temp_desc_n.length - 1])) != (-1)) {
                            tag_status = true;
                        }
                    }

                    if (tag_status) {
                        body_content += '<div class="cont_wrp_box mt-4">';
                    }
                    //for (var i = 0; i < para_ids.length; i++) {

                    var content_html_temp = '';
                    var xmlText = new XMLSerializer();
                    if ($(this).find('content').length != 0) {
                        if ($(this).find('content').children('para').length == 0) {
                            content_html_temp += $(this).find('content').text();
                        } else {
                            for (var m = 0; m < this.getElementsByTagName("content")[0].childNodes.length; m++)
                            {
                                if (this.getElementsByTagName("content")[0].childNodes[m].nodeName == 'para') {
                                    content_html_temp += xmlText.serializeToString(this.getElementsByTagName("content")[0].childNodes[m]);
                                    //console.log(xmlText.serializeToString(this.getElementsByTagName("content")[0].childNodes[m]));
                                }
                            }
                        }
                    }

                    var notes_html_temp = '';
                    if ($(this).find('notes').length != 0) {
                        if ($(this).find('notes').children('para').length == 0) {
                            notes_html_temp += $(this).find('notes').text();
                        } else {
                            for (var m = 0; m < this.getElementsByTagName("notes")[0].childNodes.length; m++)
                            {
                                if (this.getElementsByTagName("notes")[0].childNodes[m].nodeName == 'para') {
                                    notes_html_temp += xmlText.serializeToString(this.getElementsByTagName("notes")[0].childNodes[m]);
                                    //console.log(xmlText.serializeToString(this.getElementsByTagName("content")[0].childNodes[m]));
                                }
                            }
                        }
                    }

                    if ($(this).find('name').length != 0 && typeof ($(this).children('name').attr('eid')) != 'undefined') {
                        var name_node = $(this).children('name').attr('eid').split('_');
                        if (para_ids.indexOf(parseInt(name_node[name_node.length - 1])) != (-1)) {
                            body_content += '<div class="content_box"><div class="sturcture_content text-danger-emphasis" style="text-align:' + $(this).attr('align') + '">';
                            body_content += '<p>' + $(this).children('name').text() + '</p>';
                            if ($(this).find('desc').length == 0 && typeof ($(this).children('desc').attr('eid')) == 'undefined') {
                                body_content += '</div></div>';
                            } else {
                                if (typeof ($(this).children('desc').attr('eid')) != 'undefined') {
                                    var _para_id = $(this).find('desc').attr('eid').split('_');
                                    if (para_ids.indexOf(parseInt(_para_id[_para_id.length - 1])) == (-1)) {
                                        body_content += '</div></div>';
                                    }
                                } else {
                                    body_content += '</div></div>';
                                }
                            }
                        }
                    }

                    if ($(this).find('desc').length != 0 && typeof ($(this).children('desc').attr('eid')) != 'undefined') {
                        var desc_node = $(this).children('desc').attr('eid').split('_');
                        if (para_ids.indexOf(parseInt(desc_node[desc_node.length - 1])) != (-1)) {

                            if ($(this).find('name').length == 0 && typeof ($(this).children('name').attr('eid')) == 'undefined') {
                                body_content += '<div class="content_box"><div class="sturcture_content text-danger-emphasis" style="text-align:' + $(this).attr('align') + '">';
                            } else {
                                var _para_id = $(this).children('name').attr('eid').split('_');
                                if (para_ids.indexOf(parseInt(_para_id[_para_id.length - 1])) == (-1)) {
                                    body_content += '<div class="content_box"><div class="sturcture_content text-danger-emphasis" style="text-align:' + $(this).attr('align') + '">';
                                }
                            }
                            body_content += '<p>' + $(this).find('desc').text() + '</p>';
                            body_content += '</div></div>';
                        }
                    }

                    if ($(this).find('notes').length != 0 && typeof ($(this).children('notes').attr('eid')) != 'undefined') {
                        var notes_node = $(this).children('notes').attr('eid').split('_');
                        if (para_ids.indexOf(parseInt(notes_node[notes_node.length - 1])) != (-1)) {
                            body_content += '<div class="content_box"><div class="notes_content text-success-emphasis fst-italic" style="text-align:' + $(this).attr('align') + '">';
                            body_content += notes_html_temp;
                            body_content += '</div></div>';
                        }
                    }

                    if ($(this).find('content').length != 0 && typeof ($(this).children('content').attr('eid')) != 'undefined') {
                        var content_node = $(this).children('content').attr('eid').split('_');
                        if (para_ids.indexOf(parseInt(content_node[content_node.length - 1])) != (-1)) {
                            body_content += xml_img;
                            body_content += '<div class="content_box"><div class="content_contents text-primary-emphasis mb-4" style="text-align:' + $(this).attr('align') + '">';
                            body_content += content_html_temp;
                            body_content += '</div></div>';
                        }
                    }
                    if (tag_status) {
                        body_content += '</div>';
                    }
                    //}
                });
                body_content = body_content.toString();
                body_content = body_content.replace(/<para/g, " <p");
                body_content = body_content.replace(/<useful/g, " <span");
                body_content = body_content.replace(/<extra_info/g, " <span");
                body_content = body_content.replace(/<\/para/g, " </p");
                body_content = body_content.replace(/<\/useful/g, "</span");
                body_content = body_content.replace(/<\/extra_info/g, "</span");
                body_content = body_content.replace(/  /g, " ");
                body_content = body_content.replace(/ ,/g, ",");
                body_content = body_content.replace(/ <\/span>,/g, "</span>,");
                body_content = body_content.replace(/\s<\/span>\./g, "</span>.");
                body_content = body_content.replace(/ <\/span> /g, "</span> ");
                body_content = body_content.replace(/<\/span>\.\./g, "</span>.");
                $('.models_content').html(body_content);
                //_this.db_clk();
                $('.show_me_btn').on('change', function(e) {
                    _this.reset_drop();
                    //$('.content_box span').removeAttr('class');
                    var show_ids = $(this).attr('data-showme').toString().split(',');
                    var color_code = $(this).attr('data-color');
                    if (this.checked) {
                        for (var i = 0; i < show_ids.length; i++) {
                            show_ids[i] = show_ids[i].split('_');
                            show_ids[i] = show_ids[i][show_ids[i].length - 1];
                            $('.content_box span').each(function() {
                                var con_id = $(this).attr('eid').split('_');
                                if (con_id[con_id.length - 1] == show_ids[i]) {
                                    $(this).addClass('highlight_txt');
                                    //$(this).css({'background-color': color_code, 'color': 'black'});
                                    $(this).addClass(color_code);
                                }
                            });
                        }
                    } else {
                        for (var i = 0; i < show_ids.length; i++) {
                            show_ids[i] = show_ids[i].split('_');
                            show_ids[i] = show_ids[i][show_ids[i].length - 1];
                            $('.content_box span').each(function() {
                                var con_id = $(this).attr('eid').split('_');
                                if (con_id[con_id.length - 1] == show_ids[i]) {
                                    //$(this).removeClass('highlight_txt');
                                    //$(this).removeAttr('style');
                                    $(this).removeClass();
                                }
                            });
                        }
                    }
                });
            }
        });
        _this.para_ids = new Array();
        $(_this.project_xml_data[_this.current_key]['xml_data']).find('step').each(function(element, index) {
            if ($(this).attr('para_ids')) {
                var temp_array = $(this).attr('para_ids').split(',');
                for (var i = 0; i < temp_array.length; i++) {
                    _this.para_ids.push(temp_array[i]);
                }
            }
        });
        for (var i = 0; i < _this.para_ids.length; i++) {
            _this.para_ids[i] = _this.para_ids[i].split('_');
            _this.para_ids[i] = _this.para_ids[i][_this.para_ids[i].length - 1];
            _this.para_ids[i] = _this.para_ids[i].trim();
        }
        //$('.show_all').children('.tick_mark').addClass('_selected');
        $('.str_common').off(event_type).on(event_type, function() {

            $('.medels_steps button').removeClass('active');
            _this.reset_drop();
            if ($(this).hasClass('show_all')) {
                if ($(this).children('.tick_mark').hasClass('_selected')) {
                    $('.str_common').each(function() {
                        $(this).children('.tick_mark').removeClass('_selected');
                    });
                } else {
                    $('.str_common').each(function() {
                        $(this).children('.tick_mark').addClass('_selected');
                    });
                }
            } else {

                $('.show_structre:hidden').children('.tick_mark').addClass('_selected');
                $('.show_notes:hidden').children('.tick_mark').addClass('_selected');
                $('.show_content:hidden').children('.tick_mark').addClass('_selected');
                $('.show_all').children('.tick_mark').removeClass('_selected');
                if ($(this).children('.tick_mark').hasClass('_selected')) {
                    $(this).children('.tick_mark').removeClass('_selected');
                } else {
                    $(this).children('.tick_mark').addClass('_selected');
                }

                if ($('.show_structre').children('.tick_mark').hasClass('_selected') && $('.show_notes').children('.tick_mark').hasClass('_selected') && $('.show_content').children('.tick_mark').hasClass('_selected')) {
                    $('.show_all').children('.tick_mark').addClass('_selected');
                }
            }

            $('.models_header').empty();
            $('.models_content').empty();
            var content_data = '';
            $(_this.project_xml_data[_this.current_key]['xml_data']).find('paragraph').each(function() {


                var tag_status = false;
                var xml_img = '';
                if ($(this).find('content').length != 0 || $(this).find('notes').length != 0 || $(this).find('name').length != 0 || $(this).find('desc').length != 0) {
                    tag_status = true;
                }

                if (tag_status) {
                    content_data += '<div class="cont_wrp_box mt-4">';
                }


                var content_html_temp = '';
                var xmlText = new XMLSerializer();
                if ($(this).find('content').length != 0) {

                    if (typeof ($(this).children('content').attr('image')) != 'undefined') {
                        xml_img = '<img class="img-fluid mb-2 mx-auto d-block" src="' + _this.xml_img_path + '/' + $(this).children('content').attr('image') + '"/>';
                    }


                    if ($(this).find('content').children('para').length == 0) {
                        content_html_temp += $(this).find('content').text();
                    } else {
                        for (var m = 0; m < this.getElementsByTagName("content")[0].childNodes.length; m++)
                        {
                            if (this.getElementsByTagName("content")[0].childNodes[m].nodeName == 'para') {
                                content_html_temp += xmlText.serializeToString(this.getElementsByTagName("content")[0].childNodes[m]);
                            }
                        }
                    }
                }

                var notes_html_temp = '';
                if ($(this).find('notes').length != 0) {
                    if ($(this).find('notes').children('para').length == 0) {
                        notes_html_temp += $(this).find('notes').text();
                    } else {
                        for (var m = 0; m < this.getElementsByTagName("notes")[0].childNodes.length; m++)
                        {
                            if (this.getElementsByTagName("notes")[0].childNodes[m].nodeName == 'para') {
                                notes_html_temp += xmlText.serializeToString(this.getElementsByTagName("notes")[0].childNodes[m]);
                            }
                        }
                    }
                }
                $('.models_content').removeClass('d-none');
                if ($('.show_structre').children('.tick_mark').hasClass('_selected') || $('.show_all').children('.tick_mark').hasClass('_selected')) {
                    if ($(this).children('name').length != 0 && $(this).children('name').text() != "") {
                        content_data += '<div class="content_box"><div class="sturcture_content text-danger-emphasis" style="text-align:' + $(this).attr('align') + '">';
                        content_data += '<p>' + $(this).find('name').text() + '</p>';
                    } else {
                        if ($(this).children('desc').length != 0 && $(this).children('desc').text() != "") {
                            content_data += '<div class="content_box"><div class="sturcture_content text-danger-emphasis" style="text-align:' + $(this).attr('align') + '">';
                        }
                    }
                    if ($(this).children('desc').length != 0 && $(this).children('desc').text() != "") {
                        content_data += '<p>' + $(this).find('desc').text() + '</p>';
                        content_data += '</div></div>';
                    } else {
                        content_data += '</div></div>';
                    }
                }
                if ($('.show_notes').is(':visible')) {
                    if ($('.show_notes').children('.tick_mark').hasClass('_selected') || $('.show_all').children('.tick_mark').hasClass('_selected')) {
                        if ($(this).children('notes').length != 0 && $(this).children('notes').text() != "" && typeof ($(this).children('notes').attr('dup')) == 'undefined') {
                            content_data += '<div class="content_box"><div class="notes_content text-success-emphasis fst-italic" style="text-align:' + $(this).attr('align') + '">';
                            content_data += notes_html_temp;
                            content_data += '</div></div>';
                        }
                    }
                }
                if ($('.show_content').is(':visible')) {
                    if ($('.show_content').children('.tick_mark').hasClass('_selected') || $('.show_all').children('.tick_mark').hasClass('_selected')) {
                        if ($(this).children('content').length != 0 && $(this).children('content').text() != "" && typeof ($(this).children('content').attr('dup')) == 'undefined') {
                            content_data += xml_img;
                            content_data += '<div class="content_box"><div class="content_contents text-primary-emphasis mb-4" style="text-align:' + $(this).attr('align') + '">';
                            content_data += content_html_temp;
                            content_data += '</div></div>';
                        }
                    }
                }

                if (tag_status) {
                    content_data += '</div>';
                }
            });
            content_data = content_data.toString();
            if (content_data != '') {
                content_data = content_data.replace(/<para/g, " <p");
                content_data = content_data.replace(/<useful/g, " <span");
                content_data = content_data.replace(/<extra_info/g, " <span");
                content_data = content_data.replace(/<\/para/g, " </p");
                content_data = content_data.replace(/<\/useful/g, " </span");
                content_data = content_data.replace(/<\/extra_info/g, " </span");
                content_data = content_data.replace(/  /g, " ");
                content_data = content_data.replace(/ ,/g, ",");
                content_data = content_data.replace(/ <\/span>,/g, "</span>,");
                content_data = content_data.replace(/\s<\/span>\./g, "</span>.");
                content_data = content_data.replace(/ <\/span> /g, "</span> ");
                content_data = content_data.replace(/<\/span>\.\./g, "</span>.");
            }



            $('.models_content').html(content_data);
            //_this.db_clk();
            $('.cont_wrp_box').each(function() {
                if ($(this).html() == '') {
                    $(this).remove();
                }
            });
            //need to load config xml

            $('.models_header').html('<p>' + $(_this.config_msg).find('commentary_help').text() + '</p>');
            var show_top_head = true;
            $('.str_common:visible').each(function() {
                if ($(this).children('.tick_mark').hasClass('_selected')) {
                    show_top_head = false;
                }
            });
            //console.log(show_top_head);
            if (show_top_head) {
                $('.models_header').empty();
            }

        });
        $('.str_common').each(function() {
            if ($(this).hasClass('show_all')) {
                $(this).trigger(event_type);
                return false;
            }
        });
    };
    this.leftPanelWriter = function(element, wrapper) {
        _this.writerInit();
        var project_html = '';
        for (var key in _this.project_xml_data) {
            if (_this.project_xml_data[key]['framework_enabled'] === 'true') {
                project_html = project_html + '<' + element + ' data-key="' + key + '" class="list-group-item list-group-item-action d-flex"><div class="li_inner"><span class="sp_left" data-key="' + key + '">' + _this.project_xml_data[key]['project_name'] + '</span><span class="info_ic ms-2"></span></div><a href="javascript:void(0)" data-bs-toggle="popover" data-bs-content="'+ _this.project_xml_data[key]['framework_summery'] +'"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16"> <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/> </svg></a>' + '</' + element + '>';
            }
        }
        //$('.left_menu').show();
        $('.second_page_body_left').css('left', '0');
        $(wrapper).empty().append(project_html);
        $('#modelnavbar').html('Choose the type of writing you want to do');
        if (Number($(window).width()) <= 480) {
            $('#modelnavbar').text('Choose a model');
        }

        $(".info_ic").each(function(index, element) {

            $(this).attr('data-show', 'hide');
            $(this).bind(event_type, function(e) {
                if ($(window).width() <= 768) {
                    //$(".info_text").hide("blind");
                    ///$(this).parent().next().show("blind");

                    $(".info_text").slideUp();
                    //$(".info_ic").css('background-image', 'url("images/mitr/oxford/info_01.svg")');
                    if ($(this).attr('data-show') == 'hide') {
                        $(this).parent().next().slideDown();
                        $(this).attr('data-show', 'show');
                        $(this).css('filter', 'saturate(8)');
                    } else {
                        $(".info_text").slideUp();
                        $(this).attr('data-show', 'hide');
                        $(this).css('filter', 'saturate(1)');
                    }
                }
            });
            $(this).mouseover(function(e) {
                if ($(window).width() > 768) {
                    var pos = $(this).position();
                    $('.arrow_box').html($(this).parents('.li_inner').next().html());
                    $('.arrow_wrp').css('top', pos.top - ($('.arrow_wrp').height() / 2) + 16);
                    $('.arrow_wrp').css('left', pos.left + 36);
                    $('.arrow_wrp').show();
                    $(this).css('filter', 'saturate(8)');
                }
            }).mouseout(function(e) {
                if ($(window).width() > 768) {
                    $('.arrow_wrp').hide();
                    $(this).css('filter', 'saturate(1)');
                }
            });
            $('.sp_left').off('click').on('click', function(e1) {
                var scroll_pos = $('.main_wrapper').position();
                $(window).scrollTop(scroll_pos.top);
                //for device
                e1.preventDefault();
                //var left_pos = $('.second_page_body_left').position();
                $('.second_page_body').scrollTop(0);
                $('.second_page_body_left').stop();
                /*if (Number(left_pos.left) == 0) {
                    if ($(window).width() <= 480) {
                        $('.second_page_body_left').animate({'left': '-100%'});
                        $('.left_menu').css('background-position', '0px 0px');
                    } else {
                        $('.second_page_body_left').animate({'left': '-100%'});
                        $('.left_menu').css('background-position', '0px 0px');
                    }
                    //$('.models_page_body,.second_page_body,.second_page_body_left,.models_page_body_left').css('overflow-y', 'scroll');
                } else {
                    $('.second_page_body_left').animate({'left': '0'});
                    //$('.second_page_body').css('overflow', 'hidden');
                    //$('.left_menu').css('background-position', '-5px 0px');
                } */
                //end for device


                var head_html = '<div class="models_header w_models_header"><p>' + _this.project_xml_data[$(this).attr('data-key')]['framework_summery'] + '</p></div>';
                head_html += '<div class="d-grid"><button class="btn btn-primary mb-4 p-3 create_project create_pro_btn" data-type="create" data-key="' + $(this).attr('data-key') + '" role="button">Create a new project</button></div>';
                _this.current_key = $(this).attr('data-key');
                var postData = {'data-key': _this.current_key};
                
                //IndexedDB
                async function showProj() {
                    if (/academic/.test(location.pathname) == !1) {
                        var results = await connection.select({
                            from: 'iw_projects',
                            where: {data_id: _this.current_key},
                            order: {
                                by: 'date_time',
                                type: 'desc'
                            }
                        })
                    } else {
                        var results = await connection.select({
                            from: 'iw_aca_projects',
                            where: {data_id: _this.current_key},
                            order: {
                                by: 'date_time',
                                type: 'desc'
                            }
                        })
                    }
                    
                    var temp_html = '<div class="d-grid">';
                    for (var i in results) {
                        var _name = results[i]['name'].replace(/\#\|\#/g, "'");
                        _name = _name.replace(/\#\|\|\#/g, '"');
                        temp_html += '<div class="btn-group mb-2" role="group" aria-label="Project lists"><button type="button" class="text-start btn btn-outline-secondary create_project" data-key="' + results[i]['data_id'] + '" data-project="' + results[i]['name'] + '" data-type="save">' + _name + '<br>' + results[i]['dtime'] + '</button>';
                        temp_html += '<button type="button" class="btn btn-outline-danger delete_project" data-key="' + results[i]['id'] + '"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/></svg></button></div>';
                    }
                    temp_html += '</div>';
                    head_html += temp_html;

                    $('#newProjectModal').modal('show').find('.modal-body').html(head_html);
                    $('#newProjectModalLabel').text(_this.project_xml_data[_this.current_key]['project_name']);
                    $('.delete_project').unbind(event_type).bind(event_type, function(e2) {
                        e2.preventDefault();
                        $('#newProjectModal').modal('hide');
                        $('#deleteModal').modal('show');
                        $('#deleteComplete').hide();
                        $('#deleteProjName').text('Do you want to delete “' + $(this).parent().find('[data-project]').attr('data-project') + '”? This action cannot be undone.');
                        var delete_id = $(this).attr('data-key');
                        var temp_this = this;
                        $('.ok_btn_delete').off(event_type).on(event_type, function() {

                            async function removeProj() {
                                if (/academic/.test(location.pathname) == !1) {
                                    var deleteProj = await connection.remove({
                                        from: 'iw_projects',
                                        where: {
                                            id: Number(delete_id)
                                        }
                                    });
                                } else {
                                    var deleteProj = await connection.remove({
                                        from: 'iw_aca_projects',
                                        where: {
                                            id: Number(delete_id)
                                        }
                                    });
                                }
                                
                            };
                            removeProj();
                            $('#deleteComplete').show();
                            $('#confirmDelete').hide();
                            $(temp_this).prev().remove();
                            (temp_this).remove();
                        });
                        $('.can_btn_pop').off(event_type).on(event_type, function() {
                            //$('.white_content').hide();
                        });
                        return false;
                    });
                    $('.create_project').off().on(event_type, function(e3) {
                        if ($(this).attr('data-type') == 'create') {
                            _this.current_pro_name = '';
                        } else {
                            _this.current_pro_name = $(this).attr('data-project');
                        }
                        _this.create_project($(this).attr('data-key'), $(this).attr('data-type'), $(this).attr('data-project'));
                        $('#newProjectModal').modal('hide')
                    });
                }
                showProj();
            });
        });
    };
    this.writerInit = function() {
        // writer init
        _this.current_tool = 'writer';
        $('.inner_wrapper').css('overflow', 'hidden');
        $('.current_tool').text('Models');
        _this.reset_drop();
        $('.current_tool').off(event_type).on(event_type, function(e) {
            if ($('.second_page').is(':visible')) {
                $('.fn_left').trigger('click');
            } else {
                _this.switchToModel();
            }
        });
        $('.search_title p:last-child').text('Change the view by showing and hiding different elements');
        $('.iwriter_t').show();
        $('.top_model_menu_text,.models_page_menu_text').html('My Writing');
        // end writer init
    };
    this.switchToModel = function() {

        if ($(_this.project_xml_data[_this.current_key]['xml_data']).find('step').length != 0) {
            //when model exists
            if (_this.show_popup) {
                show_pop();
            } else {
                $('.white_content').hide();
                _this.modelInit();
                _this.createModel(_this.project_xml_data[_this.current_key]['project_name'], _this.current_key);
            }
        } else {
            if (_this.show_popup) {
                show_pop();
            } else {
                $('.fn_left').trigger('click');
            }

        }

        function show_pop() {
            $('.white_content').remove();
            var temp_pop = '<div class="white_content"><div class="h-100 d-flex justify-content-center align-items-center"><div class="modal-backdrop fade show" style="z-index: 0"></div><div class="alert alert-warning alert-dismissible fade show" role="alert"> <h4 class="alert-heading"><span class="alertMsg">Confirm leave?</span></h4> <button type="button" class="btn-close can_btn_pop" data-bs-dismiss="alert" aria-label="Close"></button><p>You have unsaved changes. Do you still want to leave?</p><button type="button" class="btn btn-outline-primary ok_btn_pop">Yes</button> <button type="button" class="btn btn-outline-primary can_btn_pop" data-bs-dismiss="alert">No</button> </div> </div></div>';
            $('.main_wrapper').append(temp_pop);
            $('.white_content').show();
            call_pop();
            $('.ok_btn_pop').off(event_type).on(event_type, function() {
                $('.white_content').hide();
                _this.modelInit();
                _this.createModel(_this.project_xml_data[_this.current_key]['project_name'], _this.current_key);
            });
            $('.can_btn_pop').off(event_type).on(event_type, function() {
                $('.white_content').hide();
            });
        }
    };
    this.switchFromWriter = function() {
        //if ($(_this.project_xml_data[_this.current_key]['xml_data']).find('step').length != 0) {
        //when model exists
        if (_this.show_popup) {
            $('.white_content').remove();
            var temp_pop = '<div class="white_content"><div class="h-100 d-flex justify-content-center align-items-center"><div class="modal-backdrop fade show" style="z-index: 0"></div><div class="alert alert-warning alert-dismissible fade show" role="alert"> <h4 class="alert-heading"><span class="alertMsg">Confirm leave?</span></h4> <button type="button" class="btn-close can_btn_pop" data-bs-dismiss="alert" aria-label="Close"></button><p>You have unsaved changes. Do you still want to leave?</p><button type="button" class="btn btn-outline-primary ok_btn_pop">Yes</button> <button type="button" class="btn btn-outline-primary can_btn_pop" data-bs-dismiss="alert">No</button> </div> </div></div>';
            $('.main_wrapper').append(temp_pop);
            $('.white_content').show();
            call_pop();
            $('.ok_btn_pop').off(event_type).on(event_type, function() {
                $('.white_content').hide();
                hide_elem();
                $('.fn_rigth').trigger('click');
            });
            $('.can_btn_pop').off(event_type).on(event_type, function() {
                $('.white_content').hide();
            });
        } else {
            $('.white_content').hide();
            hide_elem();
            $('.fn_rigth').trigger('click');
        }

        //} else {
        //hide_elem();
        //$('.fn_rigth').trigger(event_type);
        //}
        function hide_elem() {
            $('.common_page').hide();
            $('.second_page').show();
            $('.second_page_body_right').hide();
            $('.second_page_body_left').css('left', '0');
        }
    };
    this.switchToHome = function() {
        if (_this.current_tool == 'model') {
            hide_elem();
        } else {
            if (typeof _this.current_key != 'undefined' && $(_this.project_xml_data[_this.current_key]['xml_data']).find('step').length != 0) {
                //when model exists
                if (_this.show_popup) {
                    show_pop();
                } else {
                    $('.white_content').hide();
                    hide_elem();
                }

            } else {
                if (_this.show_popup) {
                    show_pop();
                } else {
                    hide_elem();
                }
            }
        }
        function show_pop() {
             $('.white_content').remove();
            var temp_pop = '<div class="white_content"><div class="h-100 d-flex justify-content-center align-items-center"><div class="modal-backdrop fade show" style="z-index: 0"></div><div class="alert alert-warning alert-dismissible fade show" role="alert"> <h4 class="alert-heading"><span class="alertMsg">Confirm leave?</span></h4> <button type="button" class="btn-close can_btn_pop" data-bs-dismiss="alert" aria-label="Close"></button><p>You have unsaved changes. Do you still want to leave?</p><button type="button" class="btn btn-outline-primary ok_btn_pop">Yes</button> <button type="button" class="btn btn-outline-primary can_btn_pop" data-bs-dismiss="alert">No</button> </div> </div></div>';
            $('.main_wrapper').append(temp_pop);
            $('.white_content').show();
            call_pop(); 
            $('.ok_btn_pop').off(event_type).on(event_type, function() {
                $('.white_content').hide();
                hide_elem();
            });
            $('.can_btn_pop').off(event_type).on(event_type, function() {
                $('.white_content').hide();
            });
        }
        function hide_elem() {
            window.location.href = window.location.href;
        }
    };
    this.create_project = function(data_key, data_type, data_project) {
        //$('.create_project').off().on(event_type, function(e) {
        _this.current_tool = 'writer';
        $('.current_tool').text('Models');
        $('.current_tool').off(event_type).on(event_type, function(e) {
            if ($('.second_page').is(':visible')) {
                $('.fn_left').trigger('click');
            } else {
                _this.switchToModel();
            }
        });
        $('.inner_wrapper').css('overflow', 'hidden');
        $('.tool_down_arrow').show();
        $('.top_model_menu_text,.models_page_menu_text').html('My Writing');
        _this.reset_drop();
        //e.preventDefault();
        _this.project_short_name = '';
        $('.common_page').hide();
        $('.info_text').hide();
        $('.models_page').show();
        if ($(window).width() <= 480) {
            //var left_pos = $('.models_page_body_left').position();
            //if (Number(left_pos.left) == 0) {
                //$('.models_page_body').css('overflow', 'hidden');
            //}
        }

        $('.str_common').each(function() {
            $(this).children('.tick_mark').removeClass('_selected');
        });
        $('.models_page_left_panel').html(_this.project_xml_data[data_key]['project_name']);
        console.log(_this.project_xml_data[data_key]['project_name']);
        //$('.models_page_body .left_wrapper').empty();

        $('.models_header').empty();
        $('.models_content').empty();
        var guided_html = '';
        var parent = this;
        _this.current_key = data_key;
        _this.save_type = data_type;
        _this.data_project = data_project;
        //check for filter
        var notes_status = false;
        var content_status = false;
        $('.str_common').show();
        _this.project_short_name = _this.project_xml_data[_this.current_key]['short_name'];
        if ($(window).width() <= 768) {
            if (_this.project_short_name != '') {
                $('.models_page_left_panel').html(_this.project_short_name);
            } else {
                $('.models_page_left_panel').parents('.navbar-brand').addClass('w-25');
            }
        }

        $(_this.project_xml_data[_this.current_key]['xml_data']).find('paragraph').each(function() {

            if ($(this).find('notes').length != 0) {
                notes_status = true;
            }

            if ($(this).find('content').length != 0) {
                content_status = true;
            }
        });
        if (!notes_status) {
            $('.show_notes').hide();
        }
        if (!content_status) {
            $('.show_content').hide();
        }
        //end check for filter


        $('.str_common').off(event_type).on(event_type, function() {
            _this.writer_btns(this);
        });
        $('.show_all').trigger(event_type);
        //right side content
        $('.models_header').empty();
        $('.models_content').empty();
        var content_data = '';
        var xml_dom = '';
        if (_this.save_type == 'create') {
            xml_dom = _this.project_xml_data[_this.current_key]['xml_data'];
            $(_this.project_xml_data[_this.current_key]['xml_data']).find('content').each(function() {
                $(this).removeAttr('data-val');
            });
            $(_this.project_xml_data[_this.current_key]['xml_data']).find('notes').each(function() {
                $(this).removeAttr('data-val');
            });
            _this.load_save_project(xml_dom);
        } else {
            //alert('project_name::' + data_project + 'current_key::' + _this.current_key);
            //data_project = data_project.replace(/'/g, '&#39;');
            //data_project = data_project.replace(/"/g, '&#34;');
            
            //IndexedDB
            async function loadProj() {
                if (/academic/.test(location.pathname) == !1) {
                    var load = await connection.select({
                        from: 'iw_projects',
                        where: {
                            data_id: _this.current_key,
                            name: data_project
                        }
                    })
                } else {
                    var load = await connection.select({
                        from: 'iw_aca_projects',
                        where: {
                            data_id: _this.current_key,
                            name: data_project
                        }
                    })
                }
                
                if (load.length != 0) {
                    $('.save_pro').attr('data-project-name', data_project);
                    var data = load[0]['data'];
                    data = data.replace(/\#\|\#/g, "'");
                    data = data.replace(/\#\|\|\#/g, '"');
                    _this.load_save_project(_this.StringToXML(data));
                }
            }
            loadProj();
        }


        //});
    };
    this.load_save_project = function(xml_dom) {
        var content_data = '';
        $(xml_dom).find('paragraph').each(function() {


            var tag_status = false;
            var xml_img = '';
            if ($(this).find('content').length != 0 || $(this).find('notes').length != 0 || $(this).find('name').length != 0 || $(this).find('desc').length != 0) {
                tag_status = true;
            }

            if (tag_status) {
                content_data += '<div class="cont_wrp_box mt-4">';
            }


            var content_html_temp = '';
            var xmlText = new XMLSerializer();
            if ($(this).find('content').length != 0) {

                if ($(this).find('content').length != 0) {
                    if (typeof ($(this).find('content').attr('data-val')) != 'undefined') {
                        content_html_temp += $(this).find('content').attr('data-val');
                    } else {
                        if (typeof ($(this).find('content').attr('prompt')) != 'undefined') {
                            content_html_temp += $(this).find('content').attr('prompt');
                        } else {
                            content_html_temp += 'Type your paragraph here';
                        }
                    }
                }
            }

            if ($('.show_structre').children('.tick_mark').hasClass('_selected') || $('.show_all').children('.tick_mark').hasClass('_selected')) {
                if ($(this).children('name').length != 0 && $(this).children('name').text() != "") {
                    content_data += '<div class="content_box"><div class="sturcture_content text-danger-emphasis" style="text-align:' + $(this).attr('align') + '">';
                    content_data += '<p>' + $(this).find('name').text() + '</p>';
                    if ($(this).children('tip').length != 0 && $(this).children('desc').length == 0) {
                        content_data += '<p>' + $(this).find('tip').text() + '</p>';
                    }

                } else {
                    if ($(this).children('desc').length != 0 && $(this).children('desc').text() != "") {
                        content_data += '<div class="content_box"><div class="sturcture_content text-danger-emphasis" style="text-align:' + $(this).attr('align') + '">';
                    }
                }

                if ($(this).children('desc').length != 0 && $(this).children('desc').text() != "") {
                    content_data += '<p>' + $(this).find('desc').text() + '</p>';
                    if ($(this).children('tip').length != 0) {
                        content_data += '<p>' + $(this).find('tip').text() + '</p>';
                    }
                    content_data += '</div></div>';
                } else {
                    content_data += '</div></div>';
                }
            }
            if ($('.show_notes').children('.tick_mark').hasClass('_selected') || $('.show_all').children('.tick_mark').hasClass('_selected')) {
                if ($(this).children('notes').length != 0 && typeof ($(this).children('notes').attr('dup')) == 'undefined') {
                    var temp_pl = '';
                    if (typeof ($(this).find('notes').attr('data-val')) != 'undefined') {
                        temp_pl += $(this).find('notes').attr('data-val');
                    } else {
                        temp_pl += "Type your notes here";
                    }

                    content_data += '<div class="content_box"><div data-ph="Type your notes here" class="form-control notes_content text-success-emphasis fst-italic" contenteditable="true" style="text-align:' + $(this).attr('align') + '">';
                    content_data += '';
                    content_data += '</div></div>';
                }
            }
            if ($('.show_content').children('.tick_mark').hasClass('_selected') || $('.show_all').children('.tick_mark').hasClass('_selected')) {
                if ($(this).children('content').length != 0 && typeof ($(this).children('content').attr('dup')) == 'undefined') {
                    var temp_pl = '';
                    if (typeof ($(this).find('content').attr('prompt')) != 'undefined') {
                        temp_pl += $(this).find('content').attr('prompt');
                    } else {
                        temp_pl += 'Type your paragraph here';
                    }
                    content_data += '<div class="content_box"><div data-ph="' + temp_pl + '" class="form-control content_contents text-primary-emphasis mb-4" contenteditable="true" data-align="' + $(this).attr('align') + '" style="text-align:' + $(this).attr('align') + '">';
                    content_data += content_html_temp;
                    content_data += '</div></div>';
                }
            }
            if (tag_status) {
                content_data += '</div>';
            }
        });
        content_data = content_data.toString();
        if (content_data != '') {
            content_data = content_data.replace(/<para/g, " <p");
            content_data = content_data.replace(/<useful/g, " <span");
            content_data = content_data.replace(/<extra_info/g, " <span");
            content_data = content_data.replace(/<\/para/g, " </p");
            content_data = content_data.replace(/<\/useful/g, " </span");
            content_data = content_data.replace(/<\/extra_info/g, " </span");
            content_data = content_data.replace(/  /g, " ");
            content_data = content_data.replace(/ ,/g, ",");
            content_data = content_data.replace(/ <\/span>,/g, "</span>,");
            content_data = content_data.replace(/\s<\/span>\./g, "</span>.");
            content_data = content_data.replace(/ <\/span> /g, "</span> ");
            content_data = content_data.replace(/<\/span>\.\./g, "</span>.");
        }



        $('.models_content').html(content_data);
        $('.models_content').removeClass('d-none');
        //_this.db_clk();
        //placeholder functionality

        $('.content_contents').keyup(function() {
            _this.wordCount();
        });
        $(".models_content div[contenteditable='true']").css('min-height', '23px');
        $(".models_content div[contenteditable='true']").focus(function() {
            if ($(this).text().trim() == $(this).attr('data-ph')) {
                $(this).text('');
            }
        });
        $(".models_content div[contenteditable='true']").focusout(function() {
            _this.show_popup = false;
            $(".models_content div[contenteditable='true']").each(function() {
                if ($(this).text().trim() != '') {
                    if ($(this).attr('data-ph') != $(this).text()) {
                        _this.show_popup = true;
                    }
                }

            });
        });
        $(".models_content div[contenteditable='true']").blur(function() {
            if ($(this).text().trim() == "") {
                $(this).text($(this).attr('data-ph'));
            }
            _this.show_popup = false;
            $(".models_content div[contenteditable='true']").each(function() {
                if ($(this).text().trim() != '') {
                    if ($(this).attr('data-ph') != $(this).text()) {
                        _this.show_popup = true;
                    }
                }

            });
        });
        //end of placeholder functionality

        _this.set_wheader();
        _this.wordCount();
        //end right side content

        //left side content
        var checklist_cnt = 0;
        var top_html_ck = '<div class="check_content card"><div class="card-header check_top fw-semibold d-flex justify-content-between"><span class="text-truncate me-2">Use formal and impersonal language.</span><button type="button" class="btn-close close-check-top" aria-label="Close"></button></div><div class="card-body check_con"></div></div>';
        //top_html_ck += '<div class="checklist_wrp" ><ul class="checklist_ul">';
        top_html_ck += '<div class="checklist_wrp accordion accordion-flush" id="checkListAccordion"><div class="steps_title"><p>Checklists</p></div>';
        var statis_menu = new Array();
        statis_menu[0] = 'Before you start';
        statis_menu[1] = 'Choose your language';
        statis_menu[2] = 'While you are writing';
        statis_menu[3] = 'Check';
        $(_this.project_xml_data[_this.current_key]['xml_data']).find('planning').each(function() {
            top_html_ck += '<div class="accordion-item">';
            top_html_ck += '<h2 class="accordion-header" id="flush-headingOne"><button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">' + statis_menu[0] + '</button></h2><div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#checkListAccordion"><div class="checkpoints_ul bg-body-tertiary"><div class="accordion-body">';
            $(this).find('point').each(function(_index) {
                top_html_ck += '<div>';
                top_html_ck += '<div class="form-check mb-2"><input class="form-check-input" type="checkbox" value="" id="'+ $(this).text().replace(/\s/g,'').substr(0,17) +'"><label class="form-check-label checklist_p" for="'+ $(this).text().replace(/\s/g,'').substr(0,17) +'">' + $(this).text() + '</label></div>';
                if (typeof ($(this).attr('help')) != 'undefined') {
                    top_html_ck += '<span class="ms-4 mb-2 btn btn-warning tell_me_btn" data-file="' + $(this).attr('help').split('.')[0] + '">tell me more...</span>';
                }

                top_html_ck += '</div>';
            });
            top_html_ck += '</div></div></div>';
            top_html_ck += '</div>';
        });
        $(_this.project_xml_data[_this.current_key]['xml_data']).find('vocab').each(function() {
            top_html_ck += '<div class="accordion-item">';
            top_html_ck += '<h2 class="accordion-header" id="flush-headingTwo"><button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">' + statis_menu[1] + '</button></h2><div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#checkListAccordion"><div class="checkpoints_ul bg-body-tertiary"><div class="accordion-body">';
            $(this).find('point').each(function(_index) {
                top_html_ck += '<div>';
                top_html_ck += '<div class="form-check mb-2"><input class="form-check-input" type="checkbox" value="" id="'+ $(this).text().replace(/\s/g,'').substr(0,18) +'"><label class="form-check-label checklist_p" for="'+ $(this).text().replace(/\s/g,'').substr(0,18) +'">' + $(this).text() + '</label></div>';
                if (typeof ($(this).attr('help')) != 'undefined') {
                    top_html_ck += '<span class="ms-4 mb-2 btn btn-warning tell_me_btn" data-file="' + $(this).attr('help').split('.')[0] + '">tell me more...</span>';
                }

                top_html_ck += '</div>';
            });
            top_html_ck += '</div></div></div>';
            top_html_ck += '</div>';
        });
        $(_this.project_xml_data[_this.current_key]['xml_data']).find('writing').each(function() {
            top_html_ck += '<div class="accordion-item">';
            top_html_ck += '<h2 class="accordion-header" id="flush-headingThree"><button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">' + statis_menu[2] + '</button></h2><div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#checkListAccordion"><div class="checkpoints_ul bg-body-tertiary"><div class="accordion-body">';
            $(this).find('point').each(function(_index) {
                top_html_ck += '<div>';
                top_html_ck += '<div class="form-check mb-2"><input class="form-check-input" type="checkbox" value="" id="'+ $(this).text().replace(/\s/g,'').substr(0,19) +'"><label class="form-check-label checklist_p" for="'+ $(this).text().replace(/\s/g,'').substr(0,19) +'">' + $(this).text() + '</label></div>';
                if (typeof ($(this).attr('help')) != 'undefined') {
                    top_html_ck += '<span class="ms-4 mb-2 btn btn-warning tell_me_btn" data-file="' + $(this).attr('help').split('.')[0] + '">tell me more...</span>';
                }

                top_html_ck += '</div>';
            });
            top_html_ck += '</div></div></div>';
            top_html_ck += '</div>';
        });
        $(_this.project_xml_data[_this.current_key]['xml_data']).find('checking').each(function() {
            top_html_ck += '<div class="accordion-item">';
            top_html_ck += '<h2 class="accordion-header" id="flush-headingFour"><button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">' + statis_menu[3] + '</button></h2><div id="flush-collapseFour" class="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#checkListAccordion"><div class="checkpoints_ul bg-body-tertiary"><div class="accordion-body">';
            $(this).find('point').each(function(_index) {
                top_html_ck += '<div>';
                top_html_ck += '<div class="form-check mb-2"><input class="form-check-input" type="checkbox" value="" id="'+ $(this).text().replace(/\s/g,'').substr(0,20) +'"><label class="form-check-label checklist_p" for="'+ $(this).text().replace(/\s/g,'').substr(0,20) +'">' + $(this).text() + '</label></div>';
                if (typeof ($(this).attr('help')) != 'undefined') {
                    top_html_ck += '<span class="ms-4 mb-2 btn btn-warning tell_me_btn" data-file="' + $(this).attr('help').split('.')[0] + '">tell me more...</span>';
                }

                top_html_ck += '</div>';
            });
            top_html_ck += '</div></div></div>';
            top_html_ck += '</div>';
        });
        top_html_ck += '</div>'; //end accordion
        $('.left_wrapper').empty().html(top_html_ck);
        //$('.checkpoints').hide();
        /*$('.menu_1').off('click').on('click', function(e_p) {

            if (!$(this).hasClass('_select')) {
                $(this).addClass('_select');
                $(this).next('.checkpoints').show('blind');
                $(this).parent('li').css('background-image', 'url("images/mitr/up_a.svg")');
                var pr_thi = this;
                $('.menu_1').each(function(e_c) {
                    if (pr_thi != this) {
                        $(this).next('.checkpoints').hide('blind');
                        $(this).removeClass('_select');
                        $(this).parent('li').css('background-image', 'url("images/mitr/down_a.svg")');
                    }
                });
            } else {
                $(this).next('.checkpoints').hide('blind');
                $(this).removeClass('_select');
                $(this).parent('li').css('background-image', 'url("images/mitr/down_a.svg")');
            }
        });*/
        $('.close-check-top').off(event_type).on(event_type, function() {
            $('.check_content').hide();
            $('.checklist_wrp').show();
        });
        $('.tell_me_btn').off(event_type).on(event_type, function() {
            $('.check_top span').text($(this).parent().find('.checklist_p').text());
            $('.check_content').show();
            $('.checklist_wrp').hide();
            if (/academic/.test(location.pathname) == !1) {
                $('.check_con').html(writer_content[$(this).attr('data-file')]);
            } else {
                $('.check_con').html(writer_aca_content[$(this).attr('data-file')]);
            }
        });
        //left side content

        //load btn
        $('.prolist_load').empty();
        $('.load_pop_d').hide();
        var load_status = true;
        
        $('.load_pro').bind("mouseover touchend", function(e) {
            if (e.type == event_type) {
                load_pro(e);
                //$('.load_pop_d').show().css('right', '0px').css('top', '0px');
            } else {
                load_pro(e);
            }
        });
        
        function load_pro(e) {
            if (load_status) {
                //ajax
                load_status = false;
                var postData = {'data-key': _this.current_key};
                //IndexedDB
                async function allProj() {
                    if (/academic/.test(location.pathname) == !1) {
                        var lists = await connection.select({
                            from: 'iw_projects',
                            where: {
                                data_id: postData['data-key']
                            },
                            order: {
                                by: 'date_time',
                                type: 'desc'
                            }
                        })
                    } else {
                        var lists = await connection.select({
                            from: 'iw_aca_projects',
                            where: {
                                data_id: postData['data-key']
                            },
                            order: {
                                by: 'date_time',
                                type: 'desc'
                            }
                        })
                    }
                    
                    if (lists.length != 0) {
                        var temp_html = (_this.current_pro_name === '' ? '' : '<li><a class="dropdown-item disabled">Current project name: <span class="proj_curr_nam">'+ _this.current_pro_name +'</span></a></li><li><hr class="dropdown-divider"></li>');
                        for (var i in lists) {
                            var _name = lists[i]['name'].replace(/\#\|\#/g, "'");
                            _name = _name.replace(/\#\|\|\#/g, '"');
                            temp_html += '<li class="dropdown-item" role="button" data-type="save" data-project="' + lists[i]['name'] + '" data-key="' + lists[i]['data_id'] + '">' + _name + '</li>';
                        }
                        //temp_html += '';
                        $('.prolist_load').empty().html(temp_html);
                        $('.load_pop_d').show().css('right', '105%').css('top', '0px');
                        if (e.type == event_type || e.type == 'click') {
                            // for device
                            $('.load_pop_d').show().css('right', '0px').css('top', '0px').css('z-index', '10');
                            $('.load_pop_d').children('.arrowp_box').addClass('remove_arrow');
                        }
                        $('.tool_down_arrow_wrp li,.tool_wrapper li').mouseout(function() {
                            if (!$(this).hasClass('load_pro')) {
                                $('.load_pop_d').hide();
                            }
                        });
                        $('.prolist_load li').off(event_type).on(event_type, function() {
                            if (_this.show_popup) {
                                $('.white_content').remove();
                                var temp_pop = '<div class="white_content"><div class="h-100 d-flex justify-content-center align-items-center"><div class="modal-backdrop fade show" style="z-index: 0"></div><div class="alert alert-warning alert-dismissible fade show" role="alert"> <h4 class="alert-heading"><span class="alertMsg">Confirm leave?</span></h4> <button type="button" class="btn-close can_btn_pop" data-bs-dismiss="alert" aria-label="Close"></button><p>You have unsaved changes. Do you still want to leave?</p><button type="button" class="btn btn-outline-primary ok_btn_pop">Yes</button> <button type="button" class="btn btn-outline-primary can_btn_pop" data-bs-dismiss="alert">No</button> </div> </div></div>';
                                $('.main_wrapper').append(temp_pop);
                                $('.white_content').show();
                                call_pop();
                                $('.ok_btn_pop').off(event_type).on(event_type, function() {
                                    $('.load_pop_d').hide();
                                    _this.show_popup = false;
                                    _this.current_pro_name = $(this).attr('data-project');
                                    iWriter_controller.create_project($(this).attr('data-key'), $(this).attr('data-type'), $(this).attr('data-project'));
                                });
                                $('.can_btn_pop').off(event_type).on(event_type, function() {
                                    $('.white_content').hide();
                                });
                                } else {
                                    //$('.load_pop_d').hide();
                                    _this.show_popup = false;
                                    _this.current_pro_name = $(this).attr('data-project');
                                    iWriter_controller.create_project($(this).attr('data-key'), $(this).attr('data-type'), $(this).attr('data-project'));
                                }
                        });
                        } else {
                            let HTML_empty = '<li><a class="dropdown-item disabled">(empty)</a></li>';
                            $('.prolist_load').html(HTML_empty);
                            $('.load_pop_d').hide();
                        }
                }
                allProj();
            } else {
                if ($('.prolist_load').html() != '') {
                    $('.load_pop_d').show();
                }

            }

        };
        //end load btn

        //save as
        $('.project_name').off(event_type).on(event_type, function() {
            $(this).focus();
        });
        //$('.saveas_pro').mouseover(function(event) {
        $('#saveAsModal').on('show.bs.modal', function (event) {
            //var current_class = event.target.className.split(" ")[0];
            //if (event.target.className.split(" ")[0] == 'saveas_pro') {
                if (!$('.save_pop_2').is(':visible')) {
                    $('.save_pop_1').show();
                    $('.save_pop_2,.save_pop_d').hide();
                    $('.saveas_pop_d').show().css('right', '105%').css('top', '0px');
                    $('.err').text('');
                }
            //}
        })
        $('.saveas_pro_in').bind("mouseover touchend", function(event) {
            var current_class = event.target.className.split(" ")[0];
            if (event.target.className.split(" ")[0] == 'saveas_pro') {
                if (!$('.save_pop_2').is(':visible')) {
                    $('.save_pop_1').show();
                    $('.save_pop_2,.save_pop_d').hide();
                    $('.saveas_pop_d').show().css('right', '105%').css('top', '0px');
                    $('.err').text('');
                }
            }
            //for device
            if (current_class == 'saveas_pro' || current_class == 'saveas_pro_in') {
                if (device_detect) {
                    $(this).css('z-index', '10');
                    if (!$('.save_pop_2').is(':visible')) {
                        $('.save_pop_1').show();
                        $('.save_pop_2').hide();
                        $('.saveas_pop_d,.save_pop_d').show().css('right', '105%').css('top', '0px');
                        $('.err').text('');

                        $('.saveas_pop_d').show().css('right', '0px').css('top', '0px');
                        $('.saveas_pop_d').children('.arrowp_box').addClass('remove_arrow');
                        $('.save_pop_d').hide();
                    }
                }
            }
        });
        //end save as
        
        //$('.save_pro').mouseover(function(event) {
        $('.save_pro').bind("mouseover touchend", function(event) {
            var current_class = event.target.className.split(" ")[0];
            if (event.target.className.split(" ")[0] == 'save_pro') {
                if (_this.save_type == 'create') {
                    $('.save_pop_1').show();
                    $('.save_pop_2,.saveas_pop_d').hide();
                    $('.save_pop_d').show().css('right', '105%').css('top', '0px');
                    $('.err').text('');
                }
            }
            if (current_class == 'save_pro' || current_class == 'save_pro_in') {
                if (device_detect) {
                    $(this).css('z-index', '11');
                    if (_this.save_type == 'create') {
                        $('.save_pop_1').show();
                        $('.save_pop_2,.saveas_pop_d').hide();
                        $('.err').text('');
                        $('.save_pop_d').show().css('right', '0px').css('top', '0px');
                        $('.save_pop_d').children('.arrowp_box').addClass('remove_arrow');
                        $('.saveas_pop_d').hide();
                    }
                }
            }
        });
        $('.tool_down_arrow_wrp li,.tool_wrapper li').mouseover(function() {
            if (!$(this).hasClass('save_pro')) {
                $('.save_pop_d').hide();
            }
            if (!$(this).hasClass('saveas_pro')) {
                $('.saveas_pop_d').hide();
            }
        });
        $('.can_btn,.ok_btn_common').off(event_type).on(event_type, function() {
            $('.saveas_pop_d').hide();
            $('.save_pop_d').hide();
            if ('ontouchstart' in window == !1) {
                $('.save_pop_1').show();
                $('.save_pop_2').hide();
            }
            $('.project_name').val('');
            $('.err').text('');
            $('.err').removeClass('overWrite_flag');
        });
        $('.ok_btn').off(event_type).on(event_type, function() {

            if ($(this).hasClass('create_mode')) {
                _this.save_type = 'create';
            }

            var c_x_d = new create_xml_dom();
            var html_data = new Array();
            html_data[0] = new Array(); //notes
            html_data[1] = new Array(); //content
            $(".models_content div[contenteditable='true']").each(function() {
                if ($(this).hasClass('notes_content')) {
                    html_data[0].push($(this).html());
                }
                if ($(this).hasClass('content_contents')) {
                    html_data[1].push($(this).html());
                }

            });
            //get xml data
            var data_to_save = c_x_d.generate_xml_dom($(_this.project_xml_data[_this.current_key]['xml_data']).find('paragraphs'), html_data);
            if (!data_to_save) {

            } else {

                //var dataToStore = JSON.stringify({'data-key': _this.current_key, 'project_name': 'test_project', 'xml_data': _this.XMLToString(data_to_save[0])});

                if (_this.save_type == 'create') {
                    //create project
                    var project_name = '';
                    $(".project_name").each(function() {
                        if ($(this).is(":visible")) {
                            project_name = $(this).val();
                        }
                    });
                    if (project_name != '') {

                        var postData = {'data-key': _this.current_key, 'project_name': project_name, 'xml_data': _this.XMLToString(data_to_save[0]), 'jdate': new Date()};
                        //project_name = project_name.replace(/'/g, '"');
                        //postData['xml_data'] = postData['xml_data'].replace(/'/g, '"');

                        /*project_name = project_name.replace(/'/g, '&#39;');
                         postData['xml_data'] = postData['xml_data'].replace(/'/g, '&#39;');

                         project_name = project_name.replace(/"/g, '&#34;');
                         postData['xml_data'] = postData['xml_data'].replace(/"/g, '&#34;');*/

                        project_name = project_name.replace(/'/g, '#|#');
                        postData['xml_data'] = postData['xml_data'].replace(/'/g, '#|#');
                        project_name = project_name.replace(/"/g, '#||#');
                        postData['xml_data'] = postData['xml_data'].replace(/"/g, '#||#');

                        //IndexedDB
                        async function saveProj() {
                            if (/academic/.test(location.pathname) == !1) {
                                var results = await connection.select({
                                    from: 'iw_projects',
                                    where: {
                                        data_id: postData['data-key'],
                                        name: project_name
                                    }
                                })
                            } else {
                                var results = await connection.select({
                                    from: 'iw_aca_projects',
                                    where: {
                                        data_id: postData['data-key'],
                                        name: project_name
                                    }
                                })
                            }
                            if (results.length === 0) {
                                var value = {
                                    name: project_name,
                                    data_id: postData['data-key'],
                                    data: postData['xml_data'],
                                    date_time: new Date().getTime(),
                                    dtime: new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date().getTime())
                                }
                                if (/academic/.test(location.pathname) == !1) {
                                    var results1 = await connection.insert({
                                        into: 'iw_projects',
                                        values: [value]
                                    })
                                } else {
                                    var results1 = await connection.insert({
                                        into: 'iw_aca_projects',
                                        values: [value]
                                    })
                                }
                                
                                if (results1 === 1) {
                                    _this.save_type = 'save';
                                    $('.save_pro').attr('data-project-name', project_name);
                                    $('.save_pop_1').hide();
                                    $('.save_pop_2').show();
                                    $('.pop_msg_d').text('New project created!');
                                    $('.err').text('');
                                    _this.show_popup = false;
                                    _this.current_pro_name = project_name;
                                } else {
                                    console.log(results1)
                                }
                            } else {
                                $('.err').text('This project name already exists. Do you want to overwrite it?');
                                $('.err').addClass('overWrite_flag');
                                return;
                            }
                        }
                        saveProj();
                    } else {
                        $('.err').text('Project name cannot be blank. Please enter project name.');
                    }
                } else {
                    //update project data
                    var postData = {'data-key': _this.current_key, 'project_name': $('.save_pro').attr('data-project-name'), 'xml_data': _this.XMLToString(data_to_save[0]), 'jdate': new Date()};
                    postData['xml_data'] = postData['xml_data'].replace(/'/g, '#|#');
                    postData['xml_data'] = postData['xml_data'].replace(/"/g, '#||#');
                    
                    //IndexedDB
                    async function updateProj() {
                        if (/academic/.test(location.pathname) == !1) {
                            var update = await connection.update({
                                in: 'iw_projects',
                                where: {
                                    data_id: postData['data-key'],
                                    name: postData['project_name']
                                },
                                set: {
                                    data: postData['xml_data'],
                                    date_time: new Date().getTime(),
                                    dtime: new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date().getTime())
                                }
                            })
                        } else {
                            var update = await connection.update({
                                in: 'iw_aca_projects',
                                where: {
                                    data_id: postData['data-key'],
                                    name: postData['project_name']
                                },
                                set: {
                                    data: postData['xml_data'],
                                    date_time: new Date().getTime(),
                                    dtime: new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date().getTime())
                                }
                            })
                        }
                        
                    }
                    updateProj();
                    $('.save_pop_d').show().css('right', '105%').css('top', '0px');
                    $('.save_pop_1').hide();
                    $('.save_pop_2').show();
                    $('.pop_msg_d').text('Project updated successfully.');
                    $('.err').text('');
                    _this.show_popup = false;
                    _this.current_pro_name = $('.save_pro').attr('data-project-name');
                    if (device_detect) {
                        $('.save_pop_d').show().css('right', '0px').css('top', '0px');
                        $('.arrowp_box').addClass('remove_arrow');
                    }
                }
            }
            if ($('.err').hasClass('overWrite_flag')) {
                var temp_p = $(this).parents('#saveAsModal');
                var postData = {'data-key': _this.current_key, 'project_name': postData['project_name'], 'xml_data': _this.XMLToString(data_to_save[0]), 'jdate': new Date()};
                console.log(postData['project_name']);
                //var formURL = 'database.php?update_ex';
                updateExistProj();


                postData['xml_data'] = postData['xml_data'].replace(/'/g, '#|#');
                postData['xml_data'] = postData['xml_data'].replace(/"/g, '#||#');
                
                //IndexedDB
                    async function updateExistProj() {
                        if (/academic/.test(location.pathname) == !1) {
                            var update = await connection.update({
                                in: 'iw_projects',
                                where: {
                                    data_id: postData['data-key'],
                                    name: postData['project_name']
                                },
                                set: {
                                    data: postData['xml_data'],
                                    date_time: new Date().getTime(),
                                    dtime: new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date().getTime())
                                }
                            })
                        } else {
                            var update = await connection.update({
                                in: 'iw_aca_projects',
                                where: {
                                    data_id: postData['data-key'],
                                    name: postData['project_name']
                                },
                                set: {
                                    data: postData['xml_data'],
                                    date_time: new Date().getTime(),
                                    dtime: new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date().getTime())
                                }
                            })
                        }
                        
                    }
                    //temp_p.find('.save_pop_d').show().css('right', '105%').css('top', '0px');
                    temp_p.find('.save_pop_1').hide();
                    temp_p.find('.save_pop_2').show();
                    temp_p.find('.pop_msg_d').text('Project overwritten.');
                    temp_p.find('.err').text('');
                    _this.save_type = 'save';
                    $('.save_pro').attr('data-project-name', project_name);
                    _this.show_popup = false;
                    _this.current_pro_name = project_name;
                    if (device_detect) {
                        temp_p.$('.save_pop_d').css('right', '0px').css('top', '0px');
                        temp_p.$('.arrowp_box').addClass('remove_arrow');
                    }
                    $('.err').removeClass('overWrite_flag');
            }
            load_status = true;
        });
        $('.save_pro_in').off(event_type).on(event_type, function() {
            if (_this.save_type != 'create') {
                $('.ok_btn').each(function() {
                    if (!$(this).hasClass('create_mode')) {
                        $(this).trigger(event_type);
                        return false;
                    }
                });
            }
        });
    };
    this.wordCount = function() {
        var val = '';
        var cnt = 0;
        var cnt_val = 0;
        if (_this.current_key == 12 || _this.current_key == 13 || _this.current_key == 14) {

            $('.content_contents').each(function(index) {

                var str = $(this).parents('.cont_wrp_box').find('.sturcture_content').first('p').text();
                var n = str.indexOf("Paragraph 1");
                if (n != (-1)) {
                    cnt_val = index - 1;
                }
            });
        }
        //console.log(cnt_val);
        $('.content_contents').each(function() {
            if (cnt > cnt_val) {
                if ($(this).text().trim() != '' && $(this).text().trim() != $(this).attr('data-ph')) {
                    var str = $(this).html().trim();
                    str = str.replace(/<br>/g, ' ');
                    str = str.replace(/<div>/g, ' ');
                    str = str.replace(/<\/div>/g, ' ');
                    var _str = str.split(' ');
                    for (var i = 0; i < _str.length; i++) {
                        val += _str[i];
                        val += ' ';
                    }
                    //val += $(this).text();
                    //val += ' ';
                }
            }
            cnt++;
        });
        val = val.trim();
        var words = 0;
        if (val.trim() != '') {
            words = val.replace(/\s+/gi, ' ').split(' ').length;
        }

        $('.text-bg-success').text('Word count: ' + words);
    };
    this.XMLToString = function(oXML) {

        var serializer = new XMLSerializer();
        var str = serializer.serializeToString(oXML);
        return str;
    };
    this.StringToXML = function(oString) {
        //code for IE
        if (window.ActiveXObject) {
            var oXML = new ActiveXObject("Microsoft.XMLDOM");
            oXML.loadXML(oString);
            return oXML;
        }
        // code for Chrome, Safari, Firefox, Opera, etc.
        else {
            return (new DOMParser()).parseFromString(oString, "text/xml");
        }
    };
    this.xmlToJson = function(xml) {

        // Create the return object
        var obj = {};
        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = _this.xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(_this.xmlToJson(item));
                }
            }
        }
        return obj;
    };
    this.reset_drop = function() {
        setTimeout(function() {
            $('.white_content').hide();
        });
    };
    this.writer_btns = function(element) {
        _this.reset_drop();
        if ($(element).hasClass('show_all')) {

            if ($(element).children('.tick_mark').hasClass('_selected')) {
                $('.str_common').each(function() {
                    $(this).children('.tick_mark').removeClass('_selected');
                });
            } else {
                $('.str_common').each(function() {
                    $(this).children('.tick_mark').addClass('_selected');
                });
            }
        } else {

            $('.show_structre:hidden').children('.tick_mark').addClass('_selected');
            $('.show_notes:hidden').children('.tick_mark').addClass('_selected');
            $('.show_content:hidden').children('.tick_mark').addClass('_selected');
            $('.show_all').children('.tick_mark').removeClass('_selected');
            if ($(element).children('.tick_mark').hasClass('_selected')) {
                $(element).children('.tick_mark').removeClass('_selected');
            } else {
                $(element).children('.tick_mark').addClass('_selected');
            }

            if ($('.show_structre').children('.tick_mark').hasClass('_selected') && $('.show_notes').children('.tick_mark').hasClass('_selected') && $('.show_content').children('.tick_mark').hasClass('_selected')) {
                $('.show_all').children('.tick_mark').addClass('_selected');
            }
        }

        $('.cont_wrp_box').show();
        _this.set_wheader();
        $('.sturcture_content,.content_contents,.notes_content').hide();
        if ($('.show_all').children('.tick_mark').hasClass('_selected')) {
            $('.sturcture_content,.content_contents,.notes_content').show();
        } else {
            if ($('.show_structre').children('.tick_mark').hasClass('_selected')) {
                $('.sturcture_content').show();
            }
            if ($('.show_content').children('.tick_mark').hasClass('_selected')) {
                $('.content_contents').show();
            }
            if ($('.show_notes').children('.tick_mark').hasClass('_selected')) {
                $('.notes_content').show();
            }
        }
        _this.wordCount();
    };
    this.set_wheader = function() {


        $('.cont_wrp_box').each(function() {
            if ($(this).html() == '') {
                $(this).remove();
            }
        });
        //need to load config xml

        var top_header_html = "";
        var xmlText = new XMLSerializer();
        for (var m = 0; m < $(_this.project_xml_data[_this.current_key]['xml_data']).find('framework_intro')[0].childNodes.length; m++)
        {
            if ($(_this.project_xml_data[_this.current_key]['xml_data']).find('framework_intro')[0].childNodes[m].nodeName == 'para') {
                top_header_html += xmlText.serializeToString($(_this.project_xml_data[_this.current_key]['xml_data']).find('framework_intro')[0].childNodes[m]);
            }
        }

        top_header_html = top_header_html.replace(/<para/g, " <p");
        top_header_html = top_header_html.replace(/<\/para/g, " </p");
        top_header_html += '<div class="row"><div class="col-auto"><div class="p-2 rounded-3 text-bg-success d-inline-flex">Word count: 0</div></div>';
        if (/academic/.test(location.pathname) == !0) {
            top_header_html += '<div class="col"><div type="button" class="awl_listing p-2 rounded-3 text-bg-warning d-inline-flex">AWL</div><div class="arrow_wrp" style="display:none;"><div class="arrow_box">Highlight Academic Word List</div></div></div></div>';
        }
        top_header_html += '</div>'
        $('.str_common:visible').each(function() {
            if (!$(this).children('.tick_mark').hasClass('_selected')) {
                top_header_html = $(_this.config_msg).find('commentary_help').text();
            }
        });
        $('.models_header').html(top_header_html);

        var show_top_head = true;
        //$('.str_common:visible').each(function() {
        $('.str_common').each(function() {
            if ($(this).children('.tick_mark').hasClass('_selected')) {
                show_top_head = false;
            }
        });
        //console.log(show_top_head);

        if (show_top_head) {
            $('.models_header').empty();
            $('.cont_wrp_box').hide();
        }
        
        var awl_status = false;
        
        $(".awl_listing").mouseover(function() {
            if ($(window).width() > 768) {
                var pos = $(this).position();
                $('.arrow_box').html($(this).parents('.li_inner').next().html());
                $('.arrow_wrp').css('top', pos.top - ($('.arrow_wrp').height() / 2) - 2);
                $('.arrow_wrp').css('left', pos.left + 75);
                $('.arrow_wrp').show();
            }
        }).mouseout(function(e) {
            if ($(window).width() > 768) {
                $('.arrow_wrp').hide();
            }
        });
        
        $(".awl_listing").on('click', function() {
            // var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
            var temp = "";
            if (awl_status == false) {
                var x = document.querySelectorAll(".content_contents");
                $(".awl_listing").addClass('selected');
                for (var j = 0; j < x.length; j++) {
                    global_str = x[j].innerText;
                    var a = global_str.split(/(\s)/);

                    //console.log(a);
                    for (var i = 0; i < a.length; i++) {
                        // if(format.test(a[i])){
                        temp = a[i].replace(/[^[^a-zA-Z0-9]/g, "");
                        temp = temp.toLowerCase();
                        // }
                        // else{
                        // temp = a[i].toLowerCase();
                        // }
                        if (awl_list.indexOf(temp) >= 0) {
                            a[i] = '<span class="awl_highlight" style="background-color: yellow; color: black">' + a[i] + '</span>';
                        }
                    }

                    global_str = a.join(" ");
                    x[j].innerHTML = global_str;
                }
            } else {
                $(".awl_listing").removeClass('selected');
                $(".awl_highlight").removeAttr("style");
            }
            awl_status = !(awl_status);
        });
        
    }
}

function call_pop() {
    var pops = $('.white_content');
    pops.css('top', '50%').css('left', '50%').css('margin-top', '-80vh'); //leave alert: center of the screen
}

function create_xml_dom() {

    this.generate_xml_dom = function(xml_data, html_dom_data) {

        var notes_cnt = 0;
        var content_cnt = 0;
        xml_data.find('paragraph').each(function() {
            if ($(this).find('name').length != 0) {
                if ($(this).find('notes').length != 0) {
                    $(this).find('notes').attr('data-val', html_dom_data[0][notes_cnt]);
                    //$(this).find('notes').empty();
                    notes_cnt++;
                }
                if ($(this).find('content').length != 0) {
                    $(this).find('content').attr('data-val', html_dom_data[1][content_cnt]);
                    //$(this).find('content').empty();
                    content_cnt++;
                }
            }
        });
        if (notes_cnt == 0 && content_cnt == 0) {
            return false;
        } else {
            return xml_data;
        }
    };
}

addEventListener("DOMContentLoaded", (event) => {
    initiateController()
});

(function () {
  // Multi level menu dropdown
  if ($(".dropdown-menu a.dropdown-toggle").length) {
    $(".dropdown-menu a.dropdown-toggle").on("click", function (e) {
      if (!$(this)
        .next()
        .hasClass("show")
      ) {
        $(this)
          .parents(".dropdown-menu")
          .first()
          .find(".show")
          .removeClass("show");
      }
      var $subMenu = $(this).next(".dropdown-menu");
      $subMenu.toggleClass("show");

      $(this)
        .parents("li.nav-item.dropdown.show")
        .on("hidden.bs.dropdown", function (e) {
          $(".dropdown-submenu .show").removeClass("show");
        });

      return false;
    });
  }
})();

$(function () {
    $('body').popover({
        selector: '[data-bs-toggle="popover"]',
        trigger: 'hover focus'
    })
})