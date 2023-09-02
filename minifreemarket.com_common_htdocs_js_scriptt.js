$(document).ready(function () {

    $('.textarea_autoheight').each(function () {
        const target = $(this)[0]
        target.style.height = "";
        target.style.height = target.scrollHeight + "px"
        $(this).on('input', function () {
            const target = $(this)[0]
            target.style.height = "";
            target.style.height = target.scrollHeight + "px"
        })
    })

    if ($('.tag_list').length && $('.tag_list').height() > 100) {
        $('.tag_list').addClass('spoiler').append('<a href="#" class="open">развернуть</a>');
    }
    $('.tag_list .open').click(function () {
        $(this).parent().toggleClass('spoiler');
        if ($(this).parent().hasClass('spoiler')) {
            $(this).html('развернуть');
        } else {
            $(this).html('свернуть');
        }

        return false;
    })

    $(window).load(function () {
        fix_cat_mobile_nav();
    });
    $(window).resize(function () {
        fix_cat_mobile_nav();
    });
    function fix_cat_mobile_nav() {
        var cabinet_cat_nav_width = 0;
        if ($('.catalog_inner_cats_list .inner .btn').length) {
            if ($(window).width() > 720) {
                let row = [];
                $('.catalog_inner_cats_list .inner .btn').each(function (key) {
                    let arr_key = key > $('.catalog_inner_cats_list .inner .btn').length / 2 ? 1 : 0;
                    row[arr_key] = row[arr_key] ? row[arr_key] + $(this).outerWidth(true) : $(this).outerWidth(true);
                    cabinet_cat_nav_width += $(this).outerWidth(true);

                });
                if (cabinet_cat_nav_width > $('.catalog_inner_cats_list').width()) {
                    $('.catalog_inner_cats_list .inner').width((row[0] > row[1] ? row[0] : row[1]) + 2);
                } else {
                    $('.catalog_inner_cats_list .inner').width('auto');
                }
            } else {
                $('.catalog_inner_cats_list .inner .btn').each(function () { cabinet_cat_nav_width += $(this).outerWidth(true) });
                $('.catalog_inner_cats_list .inner').width(cabinet_cat_nav_width + 20);
            }
            if ($('.catalog_inner_cats_list .inner .btn.active').length > 0 && cabinet_cat_nav_width > $('.catalog_inner_cats_list').width()) {
                var left_pos = $('.catalog_inner_cats_list .inner .btn.active').offset().left;
                left_pos -= $('.catalog_inner_cats_list').offset().left;
                if (left_pos < 0) left_pos = 0;
                console.log(left_pos)
                $('.catalog_inner_cats_list').scrollLeft(left_pos);
                console.log($('.catalog_inner_cats_list').scrollLeft())
            }
        }
    }

    $('.seller .ava.with_uploder').click(function () {
        $('.seller_change_ava input[type=file]').click();
        return false;
    });

    $('.seller_change_ava input[type=file]').change(function () {
        $(this).closest('form').submit();
    });

    $('.all_changes_saved a.close').click(function () {
        $(this).parent().fadeOut(300);
        return false;
    });

    var oldtimeout_show_all_changes_saved
    function show_all_changes_saved() {
        $('.all_changes_saved').fadeIn(300);
        if (oldtimeout_show_all_changes_saved) clearTimeout(oldtimeout_show_all_changes_saved);
        oldtimeout_show_all_changes_saved = setTimeout(function () {
            $('.all_changes_saved').fadeOut(300);
        }, 3000)
    }

    $('.folder_nav_toggle').click(function () {
        $(this).closest('.folder_nav_item').toggleClass('open');
        return false;
    });

    if ($(window).width() < 600) {
        $('.print3d_item input[type=text]').attr('placeholder', 'Стоимость');
    }

    $.get('?updatetimer');

    $(document).on('change', '.print3d_item .rb', function () {
        let id = $(this).data('id'),
            active = $(this).is(':checked') ? 1 : 0,
            price = $(this).closest('.print3d_item').find('.prod_price_value').val();
        $.post('/cabinet/print3d', { id: id, active: active, price: price }, () => { });
        if (active) {
            $('.folder_nav_title.active').parent().children('input').addClass('half_checked');
        } else {
            if ($('.print3d_item input.rb:checked').length == 0 && $('.pager').length == 0) {
                $('.folder_nav_title.active').parent().children('input').removeClass('half_checked');
                //$('.folder_nav_title.active').parent().children('input').prop('checked', false).change();
            }
            $('.folder_nav_title.active').parent().children('input').prop('checked', false);
        }
        if ($('.print3d_item input.rb').length == $('.print3d_item input.rb:checked').length) {//выбраны все
            $('.folder_nav_title.active').parent().children('input').prop('checked', true).change();
        }
        show_all_changes_saved();
    });

    $(document).on('keyup', '.print3d_item .prod_price_value', function () {
        $(this).val($(this).val().replace(/[^+\d]/g, ''));
        if ($(this).closest('.print3d_item').find('.rb').is(":checked")) {
            let id = $(this).data('id'),
                active = 1,
                price = $(this).val();
            $.post('/cabinet/print3d', { id: id, active: active, price: price }, () => { });
            show_all_changes_saved();
        }
    });

    $('.print3d_controls #select_all').change(function () {
        $('.print3d_item input.rb').prop('checked', $(this).prop('checked'));
        $.post('/cabinet/print3d', $('form.settings').serialize(), () => { });
        show_all_changes_saved();
    });

    let print3d_item_all_selected = true;
    $('.print3d_item input.rb').each(function () {
        if (!$(this).prop('checked')) {
            console.log($(this));
            print3d_item_all_selected = false;
        }
    })
    if (print3d_item_all_selected) {
        $('.print3d_controls #select_all').prop('checked', true);
    }

    if ($(window).width() > 768 && $('.product_page').length && $('.product_page').height() > 900) {
        $('.sticky_cnt').each(function () {
            $(this).height($(this).parent().height() + 30);
        });
        $('.sticky').stick_in_parent({
            offset_top: $('header').height() + 65,
            inner_scrolling: true
        });
        // $('.sticky').trigger('sticky_kit:recalc');
    }

    $('.tag_list a.add').click(function () {
        $('.tag_list_add_form').show();
        $(this).hide();
        return false;
    });

    $('.tag_list_add_form_close').click(function () {
        $('.tag_list_add_form').hide();
        $('.tag_list a.add').show();
        return false;
    });

    $('.tag_list_add_form_btn').click(function () {
        $.post('/tag/add?ajax=1', { item: $(this).data('id'), text: $(this).parent().children('input').val() }, function (data) {
            if (data.status == 'success') {
                $('.tag_list_add_form').html(data.msg.join('<br>'));
            } else {
                alert(data.errors[0]);
            }
        }, 'json');

        //$('.tag_list_add_form').hide();
        //$('.tag_list a.add').show();
        return false;
    });

    $('.tag_list_add_form input, .tag_placeholders_input').keyup(function () {
        if ($(this).val().length > 1) {
            let words = $(this).val().split(',');
            $.each(words, function (key, word) {
                words[key] = word.trim();
            });
            let last_word = words[words.length - 1].trim();
            if (last_word.length) {
                $.post('/tag/search?ajax=1', { text: last_word }, function (data) {
                    if (data.length > 0) {
                        $('.tag_list_placeholders').html('');
                        $.each(data, function (key, word) {
                            $('.tag_list_placeholders').append('<a href="#" class="tag_list_complite">' + word + '</a>')
                        });
                        $('.tag_list_placeholders').show();
                    } else {
                        $('.tag_list_placeholders').hide();
                    }
                }, 'json')
            } else {
                $('.tag_list_placeholders').hide();
            }
        } else {
            $('.tag_list_placeholders').hide();
        }
    });

    $(document).on('click', '.tag_list_complite', function () {
        let input = $('.tag_list_add_form input').length ? $('.tag_list_add_form input') : $('.tag_placeholders_input')
        let words = input.val().split(',').map((value) => value.trim());
        words[words.length - 1] = $(this).html();
        input.val(words.join(', ') + ', ');
        $('.tag_list_placeholders').hide();
        return false;
    });

    $('.folder_nav_item input[name=select_node]').change(function () {
        if (!$(this).prop('checked')) {
            if (!confirm('Вы уверены что хотите удалить цены товаров из всей категории?')) {
                $(this).prop('checked', true);
                return false;
            }
        }
        if ($(this).parent().next().find('input[name=select_node]').length) {
            $(this).parent().next().find('input[name=select_node]').prop('checked', $(this).prop('checked'));
        }
        if ($(this).is(':checked')) {
            if ($(this).parent().children('.folder_nav_title').hasClass('active')) {
                $('.print3d_item input.rb').prop('checked', true);
            }
        } else {
            $(this).removeClass('half_checked');
            $('.print3d_item input.rb').prop('checked', false);
        }
        $.post('', { select_node: $(this).val(), active: $(this).prop('checked') ? 1 : 0 }, () => { });
    });

    $('.open_on_click').click(function () {
        $(this)
            .removeClass('telephone')
            .removeClass('email')
            .html($(this).attr('href').split(':')[1])
            .css('width', 'auto')
            .removeClass('open_on_click');
        return false;
    });

    $('.currency_buttons .btn').click(function () {
        $('.global_currencies').hide().eq($(this).index()).show();
        $(this).addClass('active').siblings().removeClass('active');
        $('input[name=rate_usd], input[name=rate_eur]').val('');
        return false;
    });

    $('body').on('click', '.reset', function () {
        if ($(this).closest('form').validate()) {
            if ($(this).closest('form').hasClass('confirm_auc')) {
                if ($('.payForm__eachInput .btn_group .btn.active').data('val') == 'auc') {
                    if (confirm($('.payForm__eachInput .btn_group .btn.active').data('confirm'))) {
                        $('.payForm__eachInput input[name="rate_usd"]').val('12');
                        $('.payForm__eachInput input[name="rate_eur"]').val(' ');
                        $(this).removeClass('submit');
                        $(this).closest('form').submit();
                    }
                } else {
                    $(this).removeClass('submit');
                    $(this).closest('form').submit();
                }
            } else {
                $(this).removeClass('submit');
                $(this).closest('form').submit();
            }
        }
        return false;
    });


    $('.after_text a').click(function () {
        $(this).parent().removeClass('short');
        $(this).remove();
        return false;
    });

    $('.form-fuck .payForm__radio_group.gg').click(function () {
        var desc = $(this).attr('data-text');
        $('textarea[name="fuck_text"]').val(desc);
    });

    $('.search-from form a.search').click(function () {
        $('html, body').animate({
            scrollTop: $(".faq").offset().top
        }, 500);
        return false;
    });

    $('.search_form input.search').on('keyup', function () {
        $('span.highlight').each(function () {
            $(this).after($(this).html()).remove();
        });
        if ($('.search_form input.search').val().length > 0) {
            const term = $('.search_form input.search').val();
            $('.answers .item .quest, .answers .item .answer').each(function () {
                $(this).html($(this).html().replace(new RegExp(term, 'ig'), '<span class="highlight">$&</span>'));
                const n = $('span.highlight').length;
                if (n == 0) $('.search_result').html('Ничего не найдено');
                else $('.search_result').html('Результатов: ' + n); if ($(this).parent().find('span.highlight').length) {
                    $(this).parent().show();
                    $(this).parent().addClass('active');
                    $(this).parent().children('.answer').show();
                } else {
                    $(this).parent().hide();
                    $(this).parent().removeClass('active');
                }
            });
            $('.search_result').show();
        } else {
            $('.answers .item').show();
            $('.answers .item').removeClass('active');
            $('.answers .item .answer').hide();
            $('.search_result').hide();
        }
    });

    $('.quest').click(function () {
        $(this).parent().toggleClass('active');
        $(this).next().slideToggle(500);
        return false;
    });

    $(".modal-claim").fancybox({

        closeBtn: false,

        modal: true,

        margin: 0,

        padding: 20,

        maxWidth: 400,

        autoScale: true,

        transitionIn: 'none',

        transitionOut: 'none',

        type: 'inline',

        helpers: {

            overlay: {

                locked: false

            }

        }

    });


    $('form#fuck').submit(function () {
        $.post('/fuck', $('form#fuck').serialize(), function (data) {
            if (data.success == 1) {
                $('form#fuck .success').html('<p>Жалоба была отправлена.</p>')
                setTimeout(function () {
                    $.fancybox.close();
                }, 1500)
            } else {
                let errors = '';
                $.each(data.errors, function (key, item) {
                    errors += item.html;
                });
                $('form#fuck div.errors').html(errors);
                console.log(data);
            }
        }, 'json');
        return false;
    })


    var product_add_autoselect_third_cat,
        product_add_set_filter_values;
    if ($(window).width() <= 500) $(".main_block .pop_cats .block_title").text('Популярное');

    if ($(window).width() <= 768) {
        var old_pageYOffset = 0,
            is_scroll_down = 1;
        let header_height = $('header').outerHeight(true);
        $(window).scroll(function () {
            let offset = window.pageYOffset > 0 ? window.pageYOffset : 0
            if (offset < header_height) {//в пределых высоты шапки
                if (!$('header').hasClass('show')) $('header').css('top', (-1 * offset) + 'px');
                if (offset == 0) $('header').removeClass('show');
                //console.log('в пределых высоты шапки');
            } else {//шапку пролистали
                if (old_pageYOffset < offset) {//вниз
                    if (is_scroll_down == 0) {
                        $('header').stop().animate({
                            top: (-1 * header_height) + 'px'
                        }, 200);
                        $('header').removeClass('show');
                        //console.log('down')
                    }
                    is_scroll_down = 1;
                } else {//вверх
                    if (is_scroll_down == 1) {
                        $('header').stop().animate({
                            top: 0
                        }, 200);
                        $('header').addClass('show');
                        // console.log('up')
                    }
                    is_scroll_down = 0;
                }
            }
            old_pageYOffset = offset;
        });
    }

    if ($('.product .mark').length != 0 && $(window).width() <= 550) {
        console.log($('.product .mark'));
        $('.product .mark').parent().parent().find('.info').css('padding-top', '15px');
    }

    $('.tooltip').tooltip();

    $('.payForm__radio_group').click(function (event) {
        var target = $(event.target);
        if (!(target.is(".check-social"))) {
            if (target.is(".payForm__radio_group") || target.is(".notice") || target.is("span")) {
                $(this).find('input').prop('checked', !$(this).find('input').prop('checked'));

                if ($(this).hasClass('delivery_item_3') && $(this).find('input').prop('checked')) {
                    $(this).closest('.content').find('.nal').hide();
                    $(this).closest('.content').find('.beznal input').prop('checked', true);
                } else {
                    $(this).closest('.content').find('.nal').show();
                }
                //console.log($(this).find('input').prop('checked') + ' hi');
                if ($(this).closest('.delivery_page').length) {
                    $(this).find('input').prop('checked', true);
                    $(this).find('input').change();

                }

            }
        }
    });

    $('.cabinet_table_cnt.table_controls .text_btn.selected_sale').click(function () {
        $('.cabinet_table_cnt.table_controls .sale_value').slideToggle(300);
        return false;
    });

    $('.sale_ok_action').click(function () {
        $.post('', $(this).closest('form').serialize() + '&sale_action', function () {
            location.reload();
        });
        return false;
    });

    $('.change_to_import_vk').change(function () {
        var count = $('.change_to_import_vk:checked').length;
        $('.import_form').css('display', (count > 0 ? 'block' : 'none'));
        $('.import_form .title span').html(count);

        $('.import_vk .import_form .title').show();
        // $('.import_vk .import_form .upload').show();
        // $('.import_vk .import_form .submit_form').hide();
        $('.import_vk .import_form .msg').hide();
        $('.import_vk .import_form .loading').hide();
        $('.import_vk .import_form .cats_block').hide();
        $('#vk_select_all_catalog').prop('checked', false);
    });

    $('.import_vk .import_form .upload').click(function () {
        $('.import_vk .import_form .loading').show();
        $.post('', $('.import_vk form.sel_products').serialize(), function (data) {
            $('.import_vk .import_form .title').hide();
            $('.import_vk .import_form .upload').hide();
            //$('.import_vk .import_form .msg').html(data.msg).show();
            $('.import_vk .import_form .loading').hide();
            $('.change_to_import_vk:checked').prop('checked', false);
            $('.import_vk .import_form .cats_block').html(data).show();
        });
        return false;
    });

    $('.import_vk .import_form').on('click', '.select_cats', function () {
        $.post('', $(this).closest('form').serialize(), function (data) {
            $('.import_vk .import_form .msg').html(data.msg).show();
            $('.import_vk .import_form .cats_block').hide();
        }, 'json');
        return false;
    });

    import_vk_groups_width();

    $(window).load(function () {
        import_vk_groups_width();

    });

    $(window).resize(function () {
        import_vk_groups_width();
    });

    function import_vk_groups_width() {
        var import_vk_groups_width = 5;
        $('.import_vk .groups a').each(function () {
            import_vk_groups_width += $(this).outerWidth(true);
        });
        $('.import_vk .groups').css('width', import_vk_groups_width);
        if ($('.import_vk .groups a.active').length) {
            var left = 0;
            $('.import_vk .groups a.active').prevAll().each(function () {
                left += $(this).outerWidth(true);
            });
            $('.import_vk .groups_cnt').scrollLeft(left);
        }
    }

    $('#vk_select_all').change(function () {
        $('.import_vk form.sel_products input').prop('checked', $(this).prop('checked'));
        $('.import_vk form.sel_products input').eq(-1).change();
    });

    $('#vk_select_all_catalog').change(function () {
        $('.import_form .title span').html($('.import_vk').data('total'));
        $('.import_form').css('display', 'block');
        $('input[name=upload_all]').val($(this).prop('checked') ? 1 : 0);
    });

    $('.import_vk .import_form .submit_form, .submit_import_vk_form').click(function () {
        $('.sel_products').submit();
        return false;
    });

    $('#mail_all_select').change(function () {
        $('.mail_send_input_select').prop('checked', $(this).prop('checked'));
        // $('.import_vk form.sel_products input').eq(-1).change();
    });
    $('#vk_send_all_select').change(function () {
        $('.vk_send_input_select').prop('checked', $(this).prop('checked'));
        // $('.import_vk form.sel_products input').eq(-1).change();
    });



    fix_blocks_height_list();

    $(window).load(function () {
        fix_blocks_height_list();
    });

    $(window).resize(function () {
        fix_blocks_height_list();
    });

    function fix_blocks_height_list() {
        $('.slick-list').each(function () {
            //fix_blocks_height($(this).find('.product .img'), 4, 4, 3, 2, 1);
            fix_blocks_height($(this).find('.product .info .cat_title'), 100, 100, 100, 100, 100);
            fix_blocks_height($(this).find('.product .info .product_title'), 100, 100, 100, 100, 100);
            fix_blocks_height($(this).find('.product .info'), 100, 100, 100, 100, 100);

        });
        //fix_blocks_height('.catalog_list .product .img', 3, 2, 2, 1, 1);
        fix_blocks_height('.catalog_list .product .info .cat_title', 3, 2, 2, 2, 2);
        fix_blocks_height('.catalog_list .product .info .product_title', 3, 2, 2, 2, 2);
        fix_blocks_height('.catalog_list .product .info', 3, 2, 2, 2, 2);
        fix_blocks_height('.cabinet_dop_item .info .text', 2, 2, 2, 2, 2);
        //fix_blocks_height($('.main_block.recommend .pop_products .product .img'), 24, 24, 24, 24, 24);
        fix_blocks_height($('.main_block.recommend .pop_products .product .info .product_title'), 4, 4, 3, 2, 2);
        fix_blocks_height($('.main_block.recommend .pop_products .product .info'), 4, 4, 3, 2, 2);
    }

    function fix_blocks_height(selector, inline, inline_1170, inline_992, inline_768, inline_550) {
        if (!$(selector).length) return false;

        $(selector).css('height', 'auto');

        if ($(window).width() <= 1170) inline = inline_1170;
        if ($(window).width() <= 992) inline = inline_992;
        if ($(window).width() <= 768) inline = inline_768;
        if ($(window).width() <= 550) inline = inline_550;
        // if(inline < 2)return true;
        //        console.log(selector);
        var cat_items = {};
        var cat_height = 0;
        var cat_len = $(selector).length;
        $(selector).each(function (key, item) {
            cat_items[key] = item;
            if ($(item).outerHeight() > cat_height) cat_height = $(item).outerHeight();
            if ((((key + 1) % inline) == 0) || (cat_len == key + 1)) {
                $.each(cat_items, function (key2, item2) {
                    $(item2).css('height', cat_height);
                });
                cat_items = {};
                cat_height = 0;
            }
        });
        return true;
    }

    $('.open_search_cats').click(function () {
        $(this).toggleClass('active');
        $(this).prev().toggle();
        return false;
    });

    $('body').click(function (event) {
        var target = $(event.target);
        if (!target.is(".serach_cats_cnt, .serach_cats_cnt *")) {
            $('.open_search_cats').removeClass('active');
            $('.serach_cats_cnt').hide();
        }
        if (!target.is(".hbtn.open_cats, .cat_menu, .cat_menu *")) {
            $('.cat_menu').slideUp(300);
            $(".hbtn.open_cats").removeClass('active');
        }
    });

    $('.serach_cats_cnt .option').click(function () {
        if ($(this).data('value')) {
            if ($(this).closest('header').length) {
                location.href = $(this).data('value') + location.search;
            } else {
                $(this).closest('.serach_cats_cnt').children('input').val($(this).data('value'))
                $(this).closest('form').submit();
            }
            return false;
        }
    });

    $('.payForm__eachInput .btn_group .btn').click(function () {
        if ($(this).data('val') && $(this).parent().next().is('input')) {
            $(this).parent().next().val($(this).data('val'));
        }
        $(this).addClass('active').siblings().removeClass('active');
        $('.btn_group_toggle').addClass('hide');
        $('.btn_group_toggle.only_' + $(this).data('val')).removeClass('hide');
        return false;
    });

    $('.v_center_block_middle .btn_group .btn').click(function () {
        if ($(this).hasClass('active')) return false;
        let val = $(this).data('val');
        if (val) {
            $('input[name=method]').val(val)
        }
        $(this).addClass('active').siblings().removeClass('active');
        $('.phone, .email').toggleClass('hide');
        // $('.btn_group_toggle.only_'+$(this).data('val')).removeClass('hide');
        return false;
    });

    function fix_catalog_product() {
        if ($(window).width() > 768) {
            $('.product_col_img').css('marginTop', $('h1').height() * -1);
        } else {
            $('.product_col_img').css('marginTop', 'auto')
        }
    }
    if ($('.product_col_img').length) {
        fix_catalog_product();
        $(window).resize(function () {
            fix_catalog_product();
        });
    }

    function fix_v_center_block() {
        $('.v_center_block').css('min-height', 'auto');
        if ($(window).width() > 620) {
            var v_center_block_height = $('body').height();
            v_center_block_height -= $('header').outerHeight(true);
            v_center_block_height -= $('footer').outerHeight(true);
            v_center_block_height -= parseInt($('.gray_bg').css('padding-bottom'));
            v_center_block_height -= parseInt($('.v_center_block').css('padding-top'));
            v_center_block_height -= 30;
            $('.v_center_block').css('min-height', v_center_block_height);
        }
    }
    if ($('.v_center_block').length) {
        fix_v_center_block();

        $(window).resize(function () {
            fix_v_center_block();
        });
        $(window).load(function () {
            fix_v_center_block();
        });
    }
    function fix_footer() {
        $('.page > .gray_bg').css('min-height', 'auto');

        if ($(window).width() > 992) {
            var v_center_block_height = $('body').height();
            //v_center_block_height -= parseInt($('.page').css('padding-top'));
            v_center_block_height -= $('header').outerHeight(true);
            v_center_block_height -= $('footer').outerHeight(true);
            v_center_block_height -= parseInt($('.gray_bg').css('padding-bottom'));
            //v_center_block_height -= 30;

            //console.log(v_center_block_height);

            $('.page > .gray_bg').css('min-height', v_center_block_height);
        }
    }
    if ($('.page > .gray_bg').length) {
        fix_footer();
        $(window).resize(function () {
            fix_footer();
        });
        $(window).load(function () {
            fix_footer();
        });
    }

    $('.cabinet_table').on('click', '.status.interactive > a', function () {
        let wh_wrapper = $(this).parent().toggleClass('active').children(".white-wrapper");
        wh_wrapper.hasClass('only_one_block') ? wh_wrapper.css('height', 90 + 'px') : wh_wrapper.css('height', 130 + 'px');
        wh_wrapper.css('width', $(this).width() + 10 + 'px');
    });

    $('.cabinet_table').on('click', '.status.interactive > a, .status.interactive > .arr', function () {
        $(this).parent().toggleClass('active').children('.drop').slideToggle(300);
        $(this).parent().toggleClass('active').children(".white-wrapper").slideToggle(300);
        return false;
    });


    $('.addcard_settings').on('click', '.status.interactive a.green.confirm', function () {
        if ($(this).hasClass('addcard')) {
            location.replace($(this).attr('href'));
            return;
        }
    });

    var last_writeprice;

    $(document).on('click', '.modal_form .print3d_modal_bot .btn', function () {
        let valid = true;
        $('.modal_form .print3d_items input').each(function () {
            if (!(parseInt($(this).val()) > 0)) {
                valid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        })
        if (valid) {
            if (last_writeprice) {
                $.post($(this).closest('form').attr('action'), $(this).closest('form').serialize());
                last_writeprice.next().click();
            } else {
                $(this).closest('form').submit();
            }
        }
        return false;
    });

    $('.cabinet_table').on('click', '.status.interactive .drop a, .status.interactive a.green.confirm, .status.interactive a.green.safepay', function () {
        var obj = $(this);

        if ($(this).hasClass('confirm')) {
            if (!confirm($(this).data('confirm'))) return false;
        }
        if ($(this).hasClass('safepay') || $(this).hasClass('addcard')) {
            location.replace($(this).attr('href'));
            return;
        }
        if ($(this).hasClass('confirm_payment')) {
            $('.modal_form.confirm_payment form').attr('action', $(this).attr('href'));
            if ($(this).closest('.order_history_table').find('.delivery_info').data('id') == 1) {
                $('.enter_delivery_price').hide();
            } else {
                $('.enter_delivery_price').show();
            }
            $('.modal_form.confirm_payment form').attr('action', $(this).attr('href'));
            $.fancybox.open({
                src: '.modal_form.confirm_payment',
                type: 'inline',
                opts: {
                    afterShow: function () {
                        $('.fancybox-container select').select2();
                    }
                }

            });
            console.log($('cart_number'));
            $('#cart_number').trigger('keyup')
            return false;
        }
        if ($(this).hasClass('writeprice')) {
            last_writeprice = $(this);
            let href = $(this).attr('href');
            $.fancybox.open({
                src: href,
                type: 'ajax',
                opts: {
                    afterShow: function () {
                        //$('.fancybox-container select').select2();
                    }
                }

            });
            return false;
        }
        if ($(this).hasClass('confirm_delivery')) {
            $('.modal_form.confirm_delivery form').attr('action', $(this).attr('href'));
            $.fancybox.open({
                src: '.modal_form.confirm_delivery',
                type: 'inline',
                opts: {
                    afterShow: function () {

                        if ($(obj).data('delivery').length) {
                            var active_delivery = $(obj).data('delivery').split(',');
                            $('.fancybox-container .toggle_delivery option').each(function () {
                                if (in_array($(this).attr('value'), active_delivery) || $(this).attr('value') == '0') {
                                    $(this).prop('disabled', false);
                                } else {
                                    $(this).prop('disabled', true);
                                }
                            });
                        }
                        //console.log(active_delivery)

                        $('.fancybox-container select').select2();
                    }
                }

            });
            return false;
        }
        if ($(this).hasClass('send_track')) {
            $('.modal_form.send_track form').attr('action', $(this).attr('href'));
            $.fancybox.open({
                src: '.modal_form.send_track',
                type: 'inline'
            });
            return false;
        }

        if ($(this).hasClass('open_reply_spoiler')) {
            $(this).closest('.order_history_table').addClass('open').find('.reply_spoiler').removeClass('hide');
            $(this).closest('.order_history_table').find('.cabinet_open_review_form').removeClass('hide');
        }

        //console.log($(this).attr('href'));
        $.get($(this).attr('href'), function (data) {
            location.reload();
            if (data.req_status == 'success') {
                $(obj).closest('.col_order_status').html('<div class="status ' + data.status_color + '">' + data.new_status + '</div>');
                if (data.reload) location.reload();
            } else if (data.error_link.length) {
                if (confirm(data.error)) location.href = data.error_link;
            } else {
                alert(data.error);
            }

        }, 'json');
        return false;
    });

    $('a.open_fuck').click(function () {
        $.fancybox.open({
            src: '.modal_form.open_fuck_' + $(this).data('id'),
            type: 'inline'
        });
        return false;
    });
    $('a.send_track.in_fuck').click(function () {
        $('.modal_form.send_track form').attr('action', $(this).attr('href'));
        $.fancybox.open({
            src: '.modal_form.send_track',
            type: 'inline'
        });
        return false;
    });
    $('.open_fuck .close_modal').click(function () {
        $.fancybox.close();
        return false;
    });

    $('body').on('change', 'select.toggle_delivery', function () {
        if ($(this).val() == 21) {//самовывоз
            $(".toggle_payway option[value='2']").attr('disabled', 'disabled').prop('disabled', true);
        } else {
            $(".toggle_payway option[value='2']").removeAttr('disabled').removeProp('disabled');
        }
        $(".toggle_payway").trigger('change');
    });

    $('body').on('change', 'select.toggle_payway', function () {
        if ($(this).val() == 1) {//на карту
            $(".toggle_cart").removeClass('hide');
        } else {
            $(".toggle_cart").addClass('hide');
        }
    });

    $('body').on('submit', '.ajax_model', function () {
        // console.log($(this).attr('action'), $(this).serialize());
        $.post($(this).attr('action'), $(this).serialize(), function (data) {
            if (data.req_status == 'success') {
                location.reload();
            } else if (data.error_link.length) {
                if (confirm(data.error)) location.href = data.error_link;
            } else {
                alert(data.error);
            }
        }, 'json');
        return false;
    });

    $('body').on('click', '.submit', function () {
        if ($(this).closest('form').validate()) {
            if ($(this).closest('form').hasClass('confirm_auc')) {
                if ($('.payForm__eachInput .btn_group .btn.active').data('val') == 'auc') {
                    if (confirm($('.payForm__eachInput .btn_group .btn.active').data('confirm'))) {
                        $(this).removeClass('submit');
                        $(this).closest('form').submit();
                    }
                } else {
                    $(this).removeClass('submit');
                    $(this).closest('form').submit();
                }
            } else {
                // $(this).removeClass('submit');
                $(this).closest('form').submit();
            }
        }
        return false;
    });

    //safecrow
    //$('.set_safecrow_check').click(function(){
    // $('.basket_seller')
    //});
    $('.safecrow_agreement_popup').click(function () {
        if (!$("#safecrow_input_popup").prop('checked')) {
            alert("Примите условия Безопасной Сделки");
            return false;
        } else {
            return true;
        }
    });

    function validSC() {
        var basket_seller_summ = 0,
            seller_name = '',
            valid = true;
        $('.basket_table tbody > tr').each(function () {
            if ($(this).find('.basket_seller').length) {//новый продавец
                basket_seller_summ = 0;
                seller_name = $(this).find('.basket_seller a').html();
            } else if ($(this).find('.set_safecrow_check').length) {//в этом tr переключатель
                if (basket_seller_summ < 400) {
                    valid = false;
                    alert('Для включения безопасной сделки сумма товаров продавца ' + seller_name + ' должна быть больше 400р.');
                }
            } else if ($(this).find('.col_summ .price').length) {
                basket_seller_summ += parseInt($(this).find('.col_summ .price').html().replace(/\D+/g, ""))
            }
        });
        return valid;
    }


    if (!$('.set_safecrow_check').hasClass('btn')) {
        $('.btn.set_safecrow_check').click(function () {
            return validSC();
        });
    }



    $('.clearfix.set_safecrow_check input').change(function () {
        if ($(this).is(':checked') && !validSC()) {
            $(this).prop('checked', false);
            return false;
        }

        $.cookie('seller_' + $(this).val() + '_off_safecrow', !$(this).prop('checked') ? 1 : 0);
        $.get('/basket/count?ajax=1', function (data) {
            update_basket_info(data.data.count, data.data.suff, data.data.summ, data.data.sale, data.data.delivery, data.data.total + data.data.scTotal, data.data.scTotal, data.data.rate);
            // console.log(data.data.rate);
        }, 'json');
        console.log($.cookie('seller_' + $(this).val() + '_off_safecrow'));
    });
    $('.clearfix.set_safecrow_check input').change();

    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        };
    }
    var isKyr = function (str) {
        return /[а-я]/i.test(str.toLowerCase());
    }

    // if($('.control_item:nth-child(2) a.val.active').attr('href') == '?currency=RUB')

    const formCardData = (card, lng) => ({
        picture_sm: card.image_uris ? card.image_uris.small : '/common/htdocs/images/5.gif',
        picture_big: card.image_uris ? card.image_uris.large : '/common/htdocs/images/5.gif',
        descrip: lng === '' ? (card.oracle_text ? card.oracle_text : card.flavor_text) : card.printed_text,
        name: lng === '' ? card.name : card.printed_name,
        name_reverse: lng === '+lang:ru' ? card.name : '',
        type_line: lng === '' ? card.type_line : card.printed_type_line,
        type: card.type_line.split(' ')[0],
        foil_prices: $('.control_item:nth-child(2) a.val.active').attr('href') === '?currency=USD' ? (card.prices.usd_foil > 0 ? card.prices.usd_foil : 0) : ($('.control_item:nth-child(2) a.val.active').attr('href') === '?currency=EUR' ? (card.prices.eur_foil > 0 ? card.prices.eur_foil : 0) : (card.prices.usd_foil > 0 ? card.prices.usd_foil * $('#rate_cur_USD').val() : 0)),
        price: $('.control_item:nth-child(2) a.val.active').attr('href') === '?currency=USD' ? (card.prices.usd > 0 ? card.prices.usd : card.prices.usd_foil) : ($('.control_item:nth-child(2) a.val.active').attr('href') === '?currency=EUR' ? (card.prices.eur > 0 ? card.prices.eur : card.prices.eur_foil) : (card.prices.usd > 0 ? card.prices.usd * $('#rate_cur_USD').val() : card.prices.usd_foil * $('#rate_cur_USD').val())),
        foil: card.foil,
        rarity: card.rarity,
        color: card.colors,
        language: card.lang,
        set_name: card.set_name,
        set: card.set,
        digital: card.digital
    })

    // const NewPriceRus = ( npr ) => ({
    //     new_name: npr.name,
    //     new_price: npr.prices.usd
    // })
    //
    //
    // const NewPriceNameRus = ( npr ) =>{
    //     let {new_name, new_price} = NewPriceRus(npr)
    //
    // }

    const appendCardToList = (selector, card, lng) => {
        let { name_reverse, digital, picture_sm, picture_big, descrip, name, price, foil_prices, type_line, type, foil, rarity, color, language } = formCardData(card, lng)
        // if(digital != true)

        $(selector).append($('<div>', {
            'class': 'card_result',
            "data-img": picture_big,
            "data-descrip": descrip,
            "data-name": name,
            "data-foil_prices": foil_prices,
            "data-price": price,
            "data-type": type,
            "data-foil": foil,
            "data-rarity": rarity,
            "data-color": color,
            "data-name_reverse": name_reverse,
            "data-language": language,
            "data-digital": digital
        })
            .append($('<img>', { 'src': picture_sm }), $('<div>', { "class": 'card_result_info' })
                .append($('<div>', { "class": 'card_result_info_title', "text": name }), $('<div>', { "class": 'card_result_info_type', "text": type_line })),
                $('<div>', { "class": 'card_result_showall' }).append($('<a>', { "class": "card_result_showall_link", "href": '#', "text": 'Все версии' }))
            )
        )
    }



    const appendCardToListAll = (selector, card, lng) => {
        let { digital, picture_sm, picture_big, descrip, name, price, foil_prices, type_line, type, foil, rarity, color, language, set_name, set } = formCardData(card, lng)
        // if(digital != true)
        $(selector).append($('<div>', {
            'class': 'card_result',
            "data-img": picture_big,
            "data-descrip": descrip,
            "data-name": name,
            "data-price": price,
            "data-foil_prices": foil_prices,
            "data-type": type,
            "data-foil": foil,
            "data-rarity": rarity,
            "data-color": color,
            "data-language": language,
            "data-set_name": set_name,
            "data-digital": digital
        })
            .append($('<img>', { 'src': picture_sm }), $('<div>', { "class": 'card_result_info' })
                .append($('<div>', { "class": 'card_result_info_title', "text": name }), $('<div>', { "class": 'card_result_info_set', "text": set.toUpperCase() }), $('<div>', { "class": 'card_result_info_type', "text": type_line })))
        )

    }

    function debounceKeyup() {
        if ($('.ajax_cnt.third_cat select').val() == 688) {
            let val = $(this).val()
            let words = [];
            words = val.split(' ')
            if ($('.cards_results .cards_loader').hasClass('hidden')) $('.cards_results .cards_loader').removeClass('hidden')
            $('.all_cards_results').html('')
            $('.cards_results').removeClass('hidden')
            let lng = isKyr(val) ? '+lang:ru' : '';
            $.get('https://api.scryfall.com/cards/search?q=' + words.join('+') + lng, function (data) {
                if (data) {
                    $('.cards_results .cards_loader').addClass('hidden')
                    console.log(data)
                    //cards = data.data.slice(0, 9);
                    data.data.map(card => {
                        appendCardToList('.cards_results .all_cards_results', card, lng);
                    })


                }
            }, 'json').fail(function () {
                $('.cards_results .cards_loader').addClass('hidden')
                $('.cards_results .all_cards_results').append($('<div>', { "text": "По Вашему запросу ничего не найдено!" }))
            });
        }
    }

    $('body').on('click', '.all_cards_results .card_result_showall', function () {
        let name = $(this).closest('.card_result').data('name')
        //$('.all_cards_show_results').removeClass('hidden')
        // let lng = isKyr(name) ? '+lang:ru' : '+not%3Amtgoid';
        let lng = isKyr(name) ? '+lang:ru' : '';
        const words = name.split(' ')
        let link = 'https://api.scryfall.com/cards/search?q=' + words.join('+') + lng + "&unique=prints&order=released&digital=false";
        $('.cards_results .all_cards_results').html('')
        $.get(link, function (data) {
            $('.cards_results .cards_loader').addClass('hidden')
            console.log(link)
            // console.log(data)
            //cards = data.data.slice(0, 9);
            data.data.map(card => {

                appendCardToListAll('.cards_results .all_cards_results', card, lng);
                // console.log(card.data[0]);
            })
        }, 'json');

        setTimeout(() => {
            $('.cards_results').removeClass('hidden')
        }, 1400)

    })


    $('#name_search').keydown(debounce(debounceKeyup, 250))

    const changeMTGFilters = (data) => {
        const colors = {
            W: '620',
            U: '621',
            B: '622',
            R: '623',
            G: '624',
            M: '625',
            N: '626'
        }
        const types = {
            creature: '633',
            instant: '636',
            sorcery: '635',
            enchantment: '632',
            artifact: '634',
            legendary: '631',
            land: '637',
            basic: '630',
        }
        const rarities = {
            common: '707',
            uncommon: '708',
            rare: '709',
            mythic: '710',
        }
        const is_foil = {
            foil: '629',
            not_foil: '629',
        }
        const language = {
            ru: '617',
            en: '618',
        }



        console.log(data)

        let card_color
        if (data.color.length == 0) card_color = colors['N'];
        else card_color = data.color.split(',').length == 1 ? colors[data.color] : colors['M']

        let card_type = types[data.type.toLowerCase()] ? types[data.type.toLowerCase()] : 0
        let card_rarity = rarities[data.rarity.toLowerCase()]
        let card_foil = data.foil ? is_foil['foil'] : is_foil['not_foil']
        let card_lng = language[data.language.toLowerCase()]


        $('.field_id_1050').find('select').val(card_rarity)//Rarity
        $('.field_id_1050').find('select').trigger('change');
        $('.field_id_1053').find('select').val(card_type)//Type
        $('.field_id_1053').find('select').trigger('change');
        $('.field_id_1052').find('select').val(card_foil)//Foil
        $('.field_id_1052').find('select').trigger('change');
        $('.field_id_1051').find('select').val(card_color)//COlor
        $('.field_id_1051').find('select').trigger('change');
        $('.field_id_1049').find('select').val(card_lng)//lng
        $('.field_id_1049').find('select').trigger('change');
        $('.field_id_1084 select option').each(function () {
            if ($(this).html() == data.set_name) {
                $('.field_id_1084').find("select").val($(this).attr('value')).trigger('change');
            }
        });
    }

    $('body').on('click', '.all_cards_results .card_result', function (e) {



        if (e.target.className == 'card_result_showall_link') return false;

        let data = $(this).data()

        let new_name = data.name_reverse ? data.name_reverse : '';

        if (data.language == 'ru') {



            $.get('https://api.scryfall.com/cards/search?q=' + new_name, function (data) {



                if (data) {
                    console.log('Погнали');

                    // повторить с интервалом 2 секунды
                    var i = 0;

                    var foil_prices_ru = $('.control_item:nth-child(2) a.val.active').attr('href') === '?currency=USD' ? (data.data[0].prices.usd_foil > 0 ? data.data[0].prices.usd_foil : 0) : ($('.control_item:nth-child(2) a.val.active').attr('href') === '?currency=EUR' ? (data.data[0].prices.eur_foil > 0 ? data.data[0].prices.eur_foil : 0) : (data.data[0].prices.usd_foil > 0 ? data.data[0].prices.usd_foil * $('#rate_cur_USD').val() : 0))


                    if (foil_prices_ru > 0) {
                        function interval() {
                            if ($('span[id*="-polovye-"]').attr('title') == 'да') {
                                $('input[name="price"]').val(foil_prices_ru);
                                // console.log("прошла " + (++i) + " секунд(а)");

                                if (i > 0) {
                                    clearInterval(intervalID);
                                    // console.log('stop');
                                }
                            }
                        }

                        var intervalID = setInterval(interval, 1000);
                    }
                    // console.log(data.data[0]);
                    var new_price = $('.control_item:nth-child(2) a.val.active').attr('href') === '?currency=USD' ? (data.data[0].prices.usd > 0 ? data.data[0].prices.usd : data.data[0].prices.usd_foil) : ($('.control_item:nth-child(2) a.val.active').attr('href') === '?currency=EUR' ? (data.data[0].prices.eur > 0 ? data.data[0].prices.eur : data.data[0].prices.eur_foil) : (data.data[0].prices.usd > 0 ? data.data[0].prices.usd * $('#rate_cur_USD').val() : data.data[0].prices.usd_foil * $('#rate_cur_USD').val()))
                    $('input[name=price]').val(parseFloat(new_price).toFixed(2));
                }
            }
            );

        } else {

            $('input[name=price]').val(parseFloat(data.price.toFixed(3)))
        }


        $('.cards_results').addClass('hidden')

        $('.field__image .uploded_img.add').before('<div class="uploded_img"><img src="' + data.img + '" alt=""><div class="controls"><a href="#" data-index="' + ($('.field__image__row .uploded_img').length - 1) + '" class="remove"></a><a href="?main=0&main_index=' + ($('.field__image__row .uploded_img').length - 1) + '" data-index="' + ($('.field__image__row .uploded_img').length - 1) + '" class="main"></a></div></div>');
        //let dataId = $('.field__image__row .uploded_img').length - 1;

        let inputCopy = $('<input type="hidden" name="card_images[]">');

        inputCopy
            .val(data.img)
            .appendTo($('.field__image__input__row'))

        $('#descrip_textarea').html(data.descrip)
        // $('input[name=price]').val(parseInt(data.price))
        $('#name_search').val(data.name)
        // alert(typeof parseFloat(123.3453346.toFixed(3)));

        var arr_target = $('.catalog_nodes_selects_cnt .payForm__eachInput')
        var target = $(arr_target[3]).removeClass('hide').find('.ajax_cnt');

        $('#first_cat_select').val('530');
        $('#first_cat_select').trigger('change');

        $.post('', { getChildNode: 530 }, function (d) {
            if (d) {
                //data = data.replace('value="533"', 'value="533" selected')
                $(target[0]).html('<select name="node[]" ' + 'class="product_change_cat"' + '>' + d + '</select>');
                $(target[0]).find("select option[value='533']").attr("selected", "selected")
                $(target[0]).find("select").trigger('change');
                $(target[0]).find('select').select2();

                $(arr_target[4]).removeClass('hide').find('.ajax_cnt');

                product_add_autoselect_third_cat = '688';
                product_add_set_filter_values = data;
                $('.cart_price_autoupdate').removeClass('hide');
            } else {
                $(target[0]).html('');
                $('.cart_price_autoupdate').addClass('hide');
            }

        });

        // повторить с интервалом 2 секунды
        var i = 0;

        if (data.foil_prices > 0) {
            function interval() {
                if ($('span[id*="-polovye-"]').attr('title') == 'да') {
                    $('input[name="price"]').val(data.foil_prices);
                    console.log("прошла " + (++i) + " секунд(а)");

                    if (i > 0) {
                        clearInterval(intervalID);
                        console.log('stop');
                    }
                }
            }

            var intervalID = setInterval(interval, 1000);

        }

    });

    $('#name_search').blur(function () {
        setTimeout(() => {
            if (!$('.cards_results').hasClass('hidden')) $('.cards_results').addClass('hidden')
        }, 200)
    })

    $('#name_search').focus(function () {
        if ($('.cards_results .all_cards_results .card_result').length > 0) $('.cards_results').removeClass('hidden')
    })


    $('body').on('blur', 'form input, form textarea', function () {
        $(this).validate();
    });
    $('body').on('keyup', 'form input, form textarea', function () {
        if ($(this).hasClass('error')) $(this).validate();
    });
    $('body').on('change', 'select', function () {
        $(this).validate();
    });

    const replaceSymbols = () => {
        //console.log($('.catalog_item_description').text().split(''))
        let descriptionText = $('.catalog_item_description').text()
        let description = descriptionText.split('')
        let symbol, symbolInfo, symbols = []
        let allSymbols = []
        let idx = description.indexOf('{'),
            idxR = description.indexOf('}')
        while (idx != -1) {
            symbol = description.slice(idx, idxR + 1)
            symbols.push(symbol.join(''))
            idx = description.indexOf('{', idx + 1)
            idxR = description.indexOf('}', idxR + 2)
        }
        // console.log(symbols)
        $.get("https://api.scryfall.com/symbology?", function (data) {
            allSymbols = data.data
        }).then(() => {
            //console.log('in promise')
            symbols.map(s => {
                symbolInfo = allSymbols.find(sI => sI.symbol == s)
                $('.catalog_item_description').html($('.catalog_item_description').html().replace(s, `<abbr class="card-symbol" style="background-image: url(${symbolInfo.svg_uri});" title="${symbolInfo.english}">${s}</abbr>`))
            })
        })



    }

    if ($('.catalog_item_description').length > 0) replaceSymbols();

    $('.toggle_next').click(function () {
        $(this).toggleClass('active');
        $(this).next().slideToggle(300);
        return false;
    });

    $('.show_filters').click(function () {
        $(this).toggleClass('open');
        $(".catalog_sorter.in_history").slideToggle(300);
        $(this).hasClass('open') ? $('.show_filters span').text('Скрыть фильтры') : $('.show_filters span').text('Показать фильтры');
        //$(this).parent().toggleClass('active').children(".white-wrapper").css('width', $(this).width()+10+'px');
    });

    if ($(window).width() > 992) {
        $(window).load(function () {
            $('.cat_menu').css('opacity', 0);
            $('.cat_menu').show();
            var max_height = 0;
            $('header .cat_menu ul.first > li, header .cat_menu li.active > ul > li').each(function () {
                if (max_height < $(this).parent().height()) max_height = $(this).parent().height();
            });
            $('header .cat_menu ul').height(max_height);
            $('.cat_menu').hide();
            $('.cat_menu').css('opacity', 1);
        });
    }

    $('.open_cats').click(function () {
        if ($(window).width() > 992) {
            $('.cat_menu').css('height', 'auto');
        } else {
            $('.cat_menu').css('height', $(window).height() - $('header').height() - 40);
            $('body').toggleClass('overflow_hidden');
        }
        $('.cat_menu').slideToggle(300);
        $(this).toggleClass('active');
        return false;
    });

    if ($(window).width() > 992) {
        $('header .cat_menu li a').hover(function () {
            $(this).parent().addClass('active').siblings().removeClass('active');
            if ($(this).closest('li.col').length) {

                $(this).closest('li.col').siblings().find('.active').removeClass('active');
            }

            $('header .cat_menu ul').css('height', 'auto');
            var max_height = 0;
            $('header .cat_menu ul.first > li, header .cat_menu li.active > ul > li').each(function () {
                if (max_height < $(this).parent().height()) max_height = $(this).parent().height();
            });
            $('header .cat_menu ul').height(max_height);

            if (!$(this).next().length) return true;
            return false;
        });
    } else {
        $('header .cat_menu ul.first > li').removeClass('active');
        $('header .cat_menu li a').click(function () {
            if ($(this).hasClass('do_link')) return true;
            $(this).parent().toggleClass('active').siblings().removeClass('active');
            if (!$(this).next().length) return true;
            return false;
        });
    }

    /*$('header .cat_menu li a').click(function() {
        $(this).parent().addClass('active').siblings().removeClass('active');
        if(!$(this).next().length) return true;
        return false;
    });*/

    $('.bot_menu .toggle').click(function () {
        $(this).next().slideToggle(300);
        $(this).toggleClass('active')
        return false;
    });

    $('.to_up').click(function () {
        $('html, body').stop().animate({ scrollTop: 0 }, 300);
        return false;
    });

    var timers = [];
    $('.timer.active').each(function (key, item) {
        timers[key] = setInterval(function () {
            var hour = parseInt($(item).find('.timer_h').html());
            var minute = parseInt($(item).find('.timer_i').html());
            var second = parseInt($(item).find('.timer_s').html());
            var end = false;

            if (second > 0) second--;
            else {
                second = 59;

                if (minute > 0) minute--;
                else {
                    second = 59;

                    if (hour > 0) hour--;
                    else end = true;
                }
            }

            $(item).find('.timer_h').html(hour);
            $(item).find('.timer_i').html(minute < 10 ? '0' + minute : minute);
            $(item).find('.timer_s').html(second < 10 ? '0' + second : second);

            $(item).find('.timer_h').next().html($(item).find('.timer_h').next().data(hour % 10 == 1 && hour != 11 ? 'ed' : (hour % 10 > 4 || hour % 10 == 0 || hour < 20 ? 'ed5' : 'eds')));
            $(item).find('.timer_i').next().html($(item).find('.timer_i').next().data(minute % 10 == 1 && minute != 11 ? 'ed' : (minute % 10 > 4 || minute % 10 == 0 || minute < 20 ? 'ed5' : 'eds')));
            $(item).find('.timer_s').next().html($(item).find('.timer_s').next().data(second % 10 == 1 && second != 11 ? 'ed' : (second % 10 > 4 || second % 10 == 0 || second < 20 ? 'ed5' : 'eds')));

            if (second % 15 == 0 || (hour == 0 && minute < 5) || end) {// && second % 3 == 0
                $.get('/updatetimer/' + $(item).data('id') + '.txt', function (data) {
                    if (!data || !data.timer_end) return;
                    var diff = new Date(data.timer_end).getTime() - new Date().getTime();

                    if (diff <= 0) {
                        clearInterval(timers[key]);
                        $(item).html('<div class="end">Завершен</div>')
                    } else {
                        hour = Math.floor((diff / 1000 / 60 / 60));
                        minute = Math.floor((diff / 1000 / 60) % 60);
                        second = Math.floor((diff / 1000) % 60);

                        $(item).find('.timer_h').html(hour);
                        $(item).find('.timer_i').html(minute < 10 ? '0' + minute : minute);
                        $(item).find('.timer_s').html(second < 10 ? '0' + second : second);

                        $(item).find('.timer_h').next().html($(item).find('.timer_h').next().data(hour % 10 == 1 && hour != 11 ? 'ed' : (hour % 10 > 4 || hour % 10 == 0 || hour < 20 ? 'ed5' : 'eds')));
                        $(item).find('.timer_i').next().html($(item).find('.timer_i').next().data(minute % 10 == 1 && minute != 11 ? 'ed' : (minute % 10 > 4 || minute % 10 == 0 || minute < 20 ? 'ed5' : 'eds')));
                        $(item).find('.timer_s').next().html($(item).find('.timer_s').next().data(second % 10 == 1 && second != 11 ? 'ed' : (second % 10 > 4 || second % 10 == 0 || second < 20 ? 'ed5' : 'eds')));


                        var rate = $(item).closest('.product_page').find('.auc_bet_block .auc_notice').data('rate');
                        var current_bet = Math.round(data.current_bet / rate * 100) / 100;
                        if (parseFloat(rate) == 1) {
                            current_bet = number_format(current_bet, 0, ".", " ");
                        } else {
                            current_bet = number_format(current_bet, 2, ".", " ");
                        }
                        $(item).closest('.product_page').find('.current_bet span').html(current_bet);
                        //$(item).closest('.product_page').find('.auc_bet_block input').val(Math.ceil((data.current_bet/rate + (50/$(item).closest('.product_page').find('.auc_bet_block .auc_notice').data('rate'))) * 100) / 100);
                        $(item).closest('.product_page').find('.bet_count span').html(data.total_bet);
                    }
                    $(item).next('.timer_end_time').html(data.date_end);
                }, 'json');
            }

        }, 1000);
    });

    var texttimers = [];
    $('.texttimer').each(function (key, item) {
        texttimers[key] = setInterval(function () {
            var hour = parseInt($(item).find('.timer_h').html());
            var minute = parseInt($(item).find('.timer_i').html());
            var second = parseInt($(item).find('.timer_s').html());
            var end = false;

            if (second > 0) second--;
            else {
                second = 59;

                if (minute > 0) minute--;
                else {
                    second = 59;

                    if (hour > 0) hour--;
                    else end = true;
                }
            }

            if (end) {
                clearInterval(texttimers[key]);
                //$(item).html('<div class="end">Завершен</div>')
                $(item).find('.timer_h').html(0);
                $(item).find('.timer_i').html(0);
                $(item).find('.timer_s').html(0);
            } else {
                $(item).find('.timer_h').html(hour);
                $(item).find('.timer_i').html(minute < 10 ? '0' + minute : minute);
                $(item).find('.timer_s').html(second < 10 ? '0' + second : second);
            }

            if ((second % 15 == 0 || (hour == 0 && minute < 5) || end) && $(item).data('id')) {//&& second % 3 == 0
                $.get('/updatetimer/' + $(item).data('id') + '.txt', function (data) {
                    if (!data || !data.timer_end) return;
                    var diff = new Date(data.timer_end).getTime() - new Date().getTime();
                    if (diff <= 0) {
                        clearInterval(texttimers[key]);
                        //$(item).html('<div class="end">Завершен</div>')
                        $(item).find('.timer_h').html(0);
                        $(item).find('.timer_i').html(0);
                        $(item).find('.timer_s').html(0);
                    } else {
                        hour = Math.floor((diff / 1000 / 60 / 60));
                        minute = Math.floor((diff / 1000 / 60) % 60);
                        second = Math.floor((diff / 1000) % 60);

                        $(item).find('.timer_h').html(hour);
                        $(item).find('.timer_i').html(minute < 10 ? '0' + minute : minute);
                        $(item).find('.timer_s').html(second < 10 ? '0' + second : second);

                        var rate = $(item).closest('.active_auc').find('.auc_bet_block .auc_notice').data('rate');
                        var current_bet = Math.round(data.current_bet / rate * 100) / 100;
                        if (parseFloat(rate) == 1) {
                            current_bet = number_format(current_bet, 0, ".", " ");
                        } else {
                            current_bet = number_format(current_bet, 2, ".", " ");
                        }
                        $(item).closest('.active_auc').find('.current_bet.global span').html(current_bet);
                        //$(item).closest('.active_auc').find('.auc_bet_block input').val(Math.ceil((data.current_bet/rate + (50/$(item).closest('.active_auc').find('.auc_bet_block .auc_notice').data('rate'))) * 100) / 100);
                        $(item).closest('.active_auc').find('.bet_count span').html(data.total_bet);
                    }
                }, 'json');
            }

        }, 1000);
    });

    //add product
    $('.buy').click(function () {
        var obj = $(this);
        var product_qty = parseInt($('.quantity[data-id=' + obj.data('id') + '] input').val());
        // product_qty += 1;
        var max = $('.quantity[data-id=' + obj.data('id') + ']').data('max');
        max -= product_qty;
        $('.quantity[data-id=' + obj.data('id') + ']').data('max', max);
        //$('.quantity[data-id=' + obj.data('id') + '] input').val(product_qty);
        // if (product_qty < 1 || isNaN(product_qty)) product_qty = 1;

        $.get($(this).attr('href') + '&ajax=1&count=' + product_qty + '&sc=1', function (data) {
            if (data.status == 'success') {
                $(obj).addClass('active').effect("transfer", { className: 'buyTransfer', to: $("header .basket") }, 500, function () {
                    $("header .basket").addClass('active');
                    $('.in_basket_count[data-id=' + obj.data('id') + '] span').html(data.item_new_count);

                    var scActive = 0;
                    if ($(obj).hasClass('safe_crow_info')) {//если переходим через кнопку БС
                        $.cookie('seller_' + $(this).data('sc') + '_off_safecrow', 0, 0, 1);
                    }
                    else {
                        $.cookie('seller_' + $(this).data('sc') + '_off_safecrow', 1, 0, 1);
                    }
                    update_basket_info(data.data.count, data.data.suff, data.data.summ, data.data.sale, data.data.delivery, data.data.total, scActive);
                    if ($(obj).hasClass('bliz')) {
                        location.href = "/order/confirm";
                    }
                    if ($(obj).hasClass('safe_crow_info')) location.href = "/order";
                });
            } else {
                alert(data.error);
            }
        }, 'json');

        return false;
    });

    $('.basket_table .remove_action').click(function () {
        $.get($(this).attr('href') + '&ajax=1', function (data) {
            if (data.status == 'success') {
                update_basket_info(data.data.count, data.data.suff, data.data.summ, data.data.sale, data.data.delivery, data.data.total);
            }
        }, 'json');
        if ($(this).closest('tr').next().html().indexOf('Безопасной сделки') != -1) {
            $(this).closest('tr').prev().remove();
            $(this).closest('tr').next().remove();
        }
        $(this).closest('tr').remove();
        if (!$('.basket_table tr').length) $('.content').html('<p>В данный момент Ваша корзина пуста</p>');

        return false;
    });

    $('.subs_container .remove_action').click(function () {
        let obj = $(this);
        let par = $(obj).closest('.subs_container_user').parent()
        $.get($(obj).attr('href') + '&ajax=1', function () {
            //  console.log(data)
        }, 'json');
        $(obj).closest('.subs_container_user').remove();
        if (!$(par).length) $(par).html(`<div class="subs_container_user">Пока пусто</div>`);
        return false;
    });

    $('.seller_buttons  .green, .seller_buttons  .red').click(function () {
        if ($(this).hasClass('redir')) return true;
        let obj = $(this);
        $.get($(obj).data('href') + '&ajax=1', function (data) {
            if (data.status) {
                switch (data.target) {
                    case 'block':
                        //$(obj).remove();
                        $(obj).parent().html('<a href="?" data-href="?unblock=1" class="red fuck"><span>Разблокировать</span></a>');
                        break
                    case 'subs':
                        $(obj).parent().html('<a href="?" data-href="?unsubscribe=1" class="green"><span>Отписаться</span></a>');
                        //$(obj).remove();
                        break
                    case 'unsubs':
                        $(obj).parent().html('<a href="?" data-href="?subscribe=1" class="green"><span>Подписаться</span></a><a href="?" data-href="?block=1" class="red fuck"><span>Заблокировать</span></a>');
                        break
                    //$(obj).remove();
                    case 'unblock':
                        // $(obj).remove();
                        $(obj).parent().html('<a href="?" data-href="?subscribe=1" class="green"><span>Подписаться</span></a><a href="?" data-href="?block=1" class="red fuck"><span>Заблокировать</span></a>');
                        break
                }
            }
        }, 'json');
        return false;
    });

    $('.delivery_page .change_delivery').change(function () {
        $.post('/order/delivery', {
            delivery: $(this).val(),
            seller: $(this).data('seller'),
            address_region: $('select[name=address_region]').val(),
            address_index: $('input[name=address_index]').val(),
            address_city: $('input[name=address_city]').val(),
            address_street: $('input[name=address_street]').val()
        }, function (data) {
            if (data.status == 'success') {
                console.log('pashet: ' + data.data.delirate);
                update_basket_info(data.data.count, data.data.suff, data.data.summ, data.data.sale, data.data.delivery, data.data.total + data.data.scTotal, data.data.scTotal, data.data.rate, data.data.delirate);
            }
        }, 'json');
        if ($(this).val() == 3 || $(this).val() == 2) {
            $(this).closest('.content').find('.nal').hide();
            $(this).closest('.content').find('.beznal input').prop('checked', true);
        } else {
            $(this).closest('.content').find('.nal').show();
        }

        return false;
    });

    function update_basket_info(count, suff, summ, sale, delivery, total, bs = 0, rate, delirate) {//
        $('header .basket span').html('( ' + count + ' )');
        $('.your_order_count').html(count + ' шт.');

        if (rate == 'RUB') {
            $('.your_order_summ').html(Math.round((summ + sale) * 100) / 100 + ` <r style="font-family: 'rouble'">e</r>`);
            $('.your_order_sale').html(Math.round(sale * 100) / 100 + ` <r style="font-family: 'rouble'">e</r>`);
            $('.your_order_summary').html(Math.round(summ * 100) / 100 + ` <r style="font-family: 'rouble'">e</r>`);
            $('.your_order_delivery').html(Math.round(delivery * 100) / 100 + ` <r style="font-family: 'rouble'">e</r>`);
            $('.your_order_total').html(Math.round(total * 100) / 100 + ` <r style="font-family: 'rouble'">e</r>`);

            if (bs != 0) {
                $('.your_order_sc').closest(".opt").show();
                $('.your_order_sc').html(Math.round(bs * 100) / 100 + ` <r style="font-family: 'rouble'">e</r>`);
            } else {
                $('.your_order_sc').closest(".opt").hide();
            }

        } else if (rate == 'USD') {
            $('.your_order_summ').html(Math.round((summ + sale) * 100) / 100 + ` $`);
            $('.your_order_sale').html(Math.round(sale * 100) / 100 + ` $`);
            $('.your_order_summary').html(Math.round(summ * 100) / 100 + ` $`);
            $('.your_order_delivery').html(Math.round(delivery * 100) / 100 + ` $`);
            $('.your_order_total').html(Math.round(total * 100) / 100 + ` $`);

            if (bs != 0) {
                $('.your_order_sc').closest(".opt").show();
                $('.your_order_sc').html(Math.round(bs * 100) / 100 + ` $`);
            } else {
                $('.your_order_sc').closest(".opt").hide();
            }

        } else if (rate == 'EUR') {
            $('.your_order_summ').html(Math.round((summ + sale) * 100) / 100 + ` €`);
            $('.your_order_sale').html(Math.round(sale * 100) / 100 + ` €`);
            $('.your_order_summary').html(Math.round(summ * 100) / 100 + ` €`);
            $('.your_order_delivery').html(Math.round(delivery * 100) / 100 + ` €`);
            $('.your_order_total').html(Math.round(total * 100) / 100 + ` €`);

            if (bs != 0) {
                $('.your_order_sc').closest(".opt").show();
                $('.your_order_sc').html(Math.round(bs * 100) / 100 + ` €`);
            } else {
                $('.your_order_sc').closest(".opt").hide();
            }

        }


    }

    $('.fav').click(function () {
        if ($(this).closest('header').length) return true;
        var obj = $(this);
        $.get('/favorite/add?ajax=1&item=' + $(this).data('id'), function (data) {
            if (data.status == 'success') {
                if (data.action == 'add') {
                    $(obj).addClass('active').effect("transfer", { className: 'favTransfer', to: $("header .fav") }, 500, function () {
                        $("header .fav").addClass('active');
                    });
                } else {
                    $(obj).removeClass('active');
                    if (data.data.count == 0) $("header .fav").removeClass('active');
                }
            } else {
                location.href = '/cabinet';
            }
        }, 'json');

        return false;
    });

    if ($('.datatime_picker').length) {
        var today = new Date();
        $('.datatime_picker').datetimepicker({
            lang: 'ru',
            step: 30,
            dayOfWeekStart: 1,
            //minDate:0,// текущая дата
            //maxDate: today.addDays(3),
            //minTime:0,
            //maxTime:'23:00',
            minDateTime: 0,
            maxDateTime: today.addDays(3),
            format: 'd.m.Y H:i',
            mask: true,
            onClose: function () {
                //$input.parent().children('.saveBtn').click();
            }
        });
    }

    if ($('input.date').length) {
        $('input.date').datetimepicker({
            lang: 'ru',
            step: 30,
            dayOfWeekStart: 1,
            timepicker: false,
            format: 'd.m.Y',
            mask: false,
            onClose: function () {
                //$input.parent().children('.saveBtn').click();
            }
        });
    }

    /* filters */
    $(".filter_multicheckbox .title").click(function () {
        $(this).toggleClass('open');
        $(this).next().toggleClass('open');
    });

    $(".content_left input.cb").change(function () {
        show_search_link($(this).next());
    });

    $('.toggle_filter').click(function () {
        if ($('.catalog_list').length) {

            $(this).toggleClass('active');

            if ($('.toggle_filter').length == 2) {//есть кнопка продавца
                if ($(this).hasClass('seller_ico')) {
                    $('.content_left .left_block').eq(0).show();
                    $('.content_left .left_block').eq(1).hide();
                } else {
                    $('.content_left .left_block').eq(1).show();
                    $('.content_left .left_block').eq(0).hide();
                }
            }

            $('.content_left')
                .css({
                    height: $(window).height() - $('header').outerHeight(true) - 11
                })
                .slideToggle(300);

            if ($(this).hasClass('active')) {
                $('html, body').css('overflow', 'hidden');
            } else {
                $('html, body').css('overflow', 'visible');
            }
        }
        return false;
    });

    $('.content_left .mobile_close').click(function () {
        $('.toggle_filter').removeClass('active');
        $('.content_left').slideUp(300);
        $('html, body').css('overflow', 'visible');
        return false;
    });

    //$('input[name=phone]').mask("+7 (###) ###-##-##", {   autoclear: false});

    $('select').each(function () {
        if (!$(this).hasClass('headersearch') && !$(this).hasClass('no_auto_init') && !$(this).hasClass('js-data-example-ajax')) {
            $(this).select2();
        }
    });

    $('header .search_cnt, .content_left .left_block form:not(.seller_change_ava)').submit(function () {
        if ($(this).attr('action') != '') {//кроме страницы пользователя
            location.href =
                (
                    $('header .search_cnt .option.active').length ?
                        $('header .search_cnt .option.active').data('value') :
                        $('header .search_cnt .option').eq(0).data('value')
                ) +
                '?' +
                $('header .search_cnt').serialize() +
                '&' +
                $('.content_left .left_block form').serialize();
            return false;
        }
    });


    if ($('select').length) $('select.headersearch').select2({
        dropdownParent: $('.search_cnt')
    });
    // $('select.headersearch').change(function () {
    //     $(this).closest('form').submit();
    // });
    $('div.catalog_sorter select').change(function () {
        location.href = $(this).val();
    });

    $('form.catalog_sorter select, form.catalog_sorter input').change(function () {
        $(this).closest('form').submit();
    });

    $('#select_all').change(function () {
        $('.col_actions input').prop('checked', $(this).prop('checked'));
    });

    $('input[name=phone]').intlTelInput({
        nationalMode: false,
        defaultCountry: "auto",
        preferredCountries: ["ru", "by", "ua", "kz"],
        geoIpLookup: function (callback) {
            $.get('https://ipinfo.io', function () { }, "jsonp").always(function (resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        },
        utilsScript: "/common/htdocs/js/vendor/libphonenumber_utils.js" // just for formatting/placeholders etc
    });

    $('input[name=cart_number]').mask("#### #### #### #?### ###", { autoclear: false });
    $(".phone_mask").mask("+7(###)###-##-##?-##-##", { autoclear: true });
    $('input[name=yandex_money_number_account]').mask("###########?#########", { autoclear: true });
    $('input[data-valid=num], input[data-valid=summ], input[data-valid=price_bliz], input[data-valid=price_reserv]').keyup(function () {
        $(this).val(inputNumberFormat($(this).val(), $(this).next().val() == 1 ? 0 : 2));
    });
    $('input[data-valid=num], input[data-valid=summ], input[data-valid=price_bliz], input[data-valid=price_reserv]').each(function () {
        $(this).val(inputNumberFormat($(this).val(), $(this).next().val() == 1 ? 0 : 2));
    })

    function inputNumberFormat(value, decimals = 0) {
        value = value.toString();
        if (!value.length) return '';
        var value_parts = value.split('.');
        return number_format(value_parts[0].replace(/[^+\d\.]/g, ''), 0, '.', ' ') +
            (value.indexOf('.') == -1 ? '' : '.') +
            (value_parts[1] ? value_parts[1] : '');
    }


    $(document).on('click', '.field__image .uploded_img.add', function () {
        let dataId = $(this).closest('form').find('.field__image__row .uploded_img').length - 1;
        let existsInput = $(this).closest('form').find('.file_upload[data-index="' + dataId + '"]');

        if (existsInput.length > 0) {
            existsInput.eq(0).val('').click();
            return false;
        }

        let inputCopy = $(this).closest('form').find('.file_upload').eq(0).clone()/*.val('').appendTo($('.field__image')).click()*/;

        inputCopy
            .val('')
            .attr('data-index', dataId)
            .appendTo($(this).closest('form').find('.field__image__input__row'))
            .click();
        return false;
    });

    $(document).on('change', '.file_upload', function () {
        var obj = $(this);
        var input = $(this)[0];
        var file = input.files[0];
        if (file.size > 10000 && file.size < 20000000) {//40кб - 20мб
            if (file.type.match('image.*')) {
                var reader = new FileReader();
                //console.log(file,reader);
                reader.onload = function (e) {
                    var img = new Image();
                    img.onload = function () {
                        if (this.width < 5000 && this.height < 5000) {
                            if ($(input).hasClass('dont-show')) {
                                $(obj).closest('form').find('.field__image .uploded_img.add').before('<div class="uploded_img"><img src="' + e.target.result + '" alt=""></div>');
                                $(obj).closest('form').find('.field__image .uploded_img.add').hide();
                            }
                            else
                                $(obj).closest('form').find('.field__image .uploded_img.add').before('<div class="uploded_img"><img src="' + e.target.result + '" alt=""><div class="controls"><a href="#" data-index="' + ($(obj).closest('form').find('.field__image__row .uploded_img').length - 1) + '" class="remove"></a><a href="?main=0&main_index=' + ($(obj).closest('form').find('.field__image__row .uploded_img').length - 1) + '" data-index="' + ($(obj).closest('form').find('.field__image__row .uploded_img').length - 1) + '" class="main"></a></div></div>');
                        } else {
                            input.remove();
                            alert('Допускаются к загрузке только картинки размером до 5000х5000 пикселей');
                            return false;
                        }
                    }
                    img.src = e.target.result;
                }
                reader.readAsDataURL(file);
            } else {
                input.remove();
                alert('Допускаются к загрузке только картинки');
                return false;
            }
        } else {
            input.remove();
            alert('Допускаются к загрузке только картинки размером от 10кб до 20 мб');
            return false;
        }
    });

    var autobet = false;
    $('.auc_bet_action').click(function () {
        if (!$('.auc_bet_block').hasClass('disabled')) {
            var cnt = $(this).closest('.auction_parent_cnt');
            var bet = parseFloat($(this).prev().val().replace(/[^+\d\.]/g, ''));
            console.log('qqqqqq', bet);
            var rate = 50 / $(cnt).find('.auc_bet_block .auc_notice').data('rate');
            var course = parseFloat($(cnt).find('.auc_bet_block .auc_notice').data('rate'));
            var ceil_bet = Math.ceil((Math.round((bet) / rate) * rate) * 100) / 100;
            if (!cnt.find('.current_bet').hasClass('red')) {
                $(cnt).find('.auc_confirm .message.confirm_message.leader_message').removeClass('hide')
                $(cnt).find('.auc_confirm .message.confirm_message:not(.leader_message)').addClass('hide')
            } else {
                $(cnt).find('.auc_confirm .message.confirm_message.leader_message').addClass('hide')
                $(cnt).find('.auc_confirm .message.confirm_message:not(.leader_message)').removeClass('hide')
            }
            $(cnt).find('.auc_confirm .message.confirm_message span').html(inputNumberFormat(ceil_bet, course == 1 ? 0 : 2)).show();
            $(this).prev().val(inputNumberFormat(ceil_bet, course == 1 ? 0 : 2));
            $(cnt).find('.auc_confirm .auc_ok').show();
            $(cnt).find('.auc_confirm .message.confirm_message').show();
            $(cnt).find('.auc_confirm .message.server_answer').remove();
            $(cnt).find('.auc_confirm').hide().removeClass('success').slideDown(300);
            autobet = $(this).hasClass('autobet_action');
        }
        return false;
    });
    $('.auc_bet_confirm_action').click(function () {
        var cnt = $(this).closest('.auction_parent_cnt');
        var bet = $(cnt).find('.auc_confirm .message.confirm_message span').html().replace(/[^+\d\.]/g, '');
        var rate = $(cnt).find('.auc_bet_block .auc_notice').data('rate');
        var course = parseFloat($(cnt).find('.auc_bet_block .auc_notice').data('rate'));
        $(cnt).find('.auc_confirm').slideUp(300);
        //отправка данных на сервер
        $.get($(cnt).find('.auc_bet_action').attr('href') + '&ajax=1&bet=' + (bet * rate) + '&autobet=' + (autobet ? 1 : 0), function (data) {
            //console.log(data);

            if (!$(cnt).find('.auc_confirm .message.server_answer').length) {
                $(cnt).find('.auc_confirm .message.confirm_message:not(.leader_message)').after('<div class="message server_answer"></div>');
            }

            $(cnt).find('.auc_confirm .message.confirm_message').hide();
            $(cnt).find('.auc_confirm .auc_ok').hide();

            if (data.status == 'success') {
                $(cnt).find('.auc_confirm .message.server_answer').html('<p class="success">' + data.success_msg + '</p>').show();

                $(cnt).find('.auc_confirm').addClass('success').slideDown(300);

                if (data.is_last_bet_current_user) {
                    $(cnt).find('.current_bet').removeClass('red');//если была ставка другова пользователя не красим в красный 
                } else {
                    $(cnt).find('.current_bet').addClass('red');
                }
                let auc_last_bet_rate = data.auc_last_bet / $(cnt).find('.auc_bet_block .auc_notice').data('rate');
                $(cnt).find('.current_bet span').html(inputNumberFormat(Math.round(auc_last_bet_rate * 100) / 100, course == 1 ? 0 : 2));
                $(cnt).find('.bet_count span').html(data.total);
                $(cnt).find('.step_bet_input').val(inputNumberFormat(Math.ceil((auc_last_bet_rate * 1 + (50 / $(cnt).find('.auc_bet_block .auc_notice').data('rate'))) * 100) / 100, course == 1 ? 0 : 2));

                var diff = new Date(data.timer_end) - Date.now();

                if (diff <= 0) {
                    $('.timer').html('<div class="end">Завершен</div>')
                } else {
                    const hour = Math.floor((diff / 1000 / 60 / 60));
                    const minute = Math.floor((diff / 1000 / 60) % 60);
                    const second = Math.floor((diff / 1000) % 60);

                    $('.timer').find('.timer_h').html(hour);
                    $('.timer').find('.timer_i').html(minute < 10 ? '0' + minute : minute);
                    $('.timer').find('.timer_s').html(second < 10 ? '0' + second : second);

                    $('.timer').find('.timer_h').next().html($('.timer').find('.timer_h').next().data(hour % 10 == 1 && hour != 11 ? 'ed' : (hour % 10 > 4 || hour % 10 == 0 || hour < 20 ? 'ed5' : 'eds')));
                    $('.timer').find('.timer_i').next().html($('.timer').find('.timer_i').next().data(minute % 10 == 1 && minute != 11 ? 'ed' : (minute % 10 > 4 || minute % 10 == 0 || minute < 20 ? 'ed5' : 'eds')));
                    $('.timer').find('.timer_s').next().html($('.timer').find('.timer_s').next().data(second % 10 == 1 && second != 11 ? 'ed' : (second % 10 > 4 || second % 10 == 0 || second < 20 ? 'ed5' : 'eds')));
                }
                $('.timer_end_time').html(data.date_end);
                if (autobet && data.is_last_bet_current_user) {
                    $('.auc_bet_block').addClass('disabled');
                    $('.auc_bet_block input').prop('disabled', true);
                }
            } else {
                $(cnt).find('.auc_confirm .message.server_answer').html(data.errors.join('<br>')).show();
                $(cnt).find('.auc_confirm').slideDown(300);
                if (data.resolve_error_on_page) {
                    setTimeout(function () {
                        location.href = data.resolve_error_on_page;
                    }, 2000);
                }
            }
            setTimeout(function () {
                $(cnt).find('.auc_confirm').slideUp(300);
            }, 5000);
        }, 'json');
        // /отправка данных на сервер
        return false;
    });


    $('header .control_item').on('click', '.val.active', function () {
        if ($(window).width() <= 992) {
            //$(this).removeClass('active');
            if ($(this).next().length) {
                //$(this).next().addClass('active');
                location.href = $(this).next().attr('href')
            } else {
                //$(this).parent().children().eq(1).addClass('active');
                location.href = $(this).parent().children().eq(1).attr('href')
            }
        }
        return false;
    });

    $('.pro_accaunt .close').click(function () {
        $(this).parent().slideUp(300);
        $.cookie('closepro', 1);
        return false;
    });

    $('#pro').click(function () {
        if (!$(this).is(':checked')) {
            alert($(this).data('text'));
            return false;
        }
    });


    $('#has_confirmed').click(function () {
        $('.fancybox-container').css('display', 'none');
        $('body').removeClass("fancybox-active compensate-for-scrollbar");
        $('#pro').prop('checked', true);
        $('.pro_types_choose').css('display', 'block');
        $.post('', { save: 1, pro: 1 });
    });

    $('#has_noconfirmed').click(function () {
        $('.fancybox-container').css('display', 'none');
        $('body').removeClass("fancybox-active compensate-for-scrollbar");
        return false;
    });

    // $('#pro').change(function(){
    //     alert(1);
    //     $.post('', {save: 1, pro: $(this).is(':checked') ? 1 : 0});
    // });

    $(window).load(function () {
        fix_cabinet_mobile_nav();
    });
    $(window).resize(function () {
        fix_cabinet_mobile_nav();
    });
    function fix_cabinet_mobile_nav() {
        if ($(window).width() >= 992) {
            $('.content_left.cabinet_hor_menu .cabinet_menu').css('width', 'auto');
            return;
        }
        var cabinet_mobile_nav_width = 0;
        $('.content_left.cabinet_hor_menu .cabinet_menu li').each(function () { cabinet_mobile_nav_width += $(this).outerWidth(true) });
        $('.content_left.cabinet_hor_menu .cabinet_menu').width(cabinet_mobile_nav_width + 20);
        if ($('.content_left.cabinet_hor_menu .cabinet_menu li.active').length) {
            var left_pos = 25;
            if ($(window).width() <= 768) left_pos -= 18;
            $('.content_left.cabinet_hor_menu .filter_inner.seller_infoblock').scrollLeft($('.content_left.cabinet_hor_menu .cabinet_menu li.active').offset().left - left_pos);
        }
    }




    $('.cabinet_open_review_form').click(function () {
        if ($(window).width() <= '720') {

            $('.hiddebefore720').removeClass('hiddebefore720');
        }
        $(this).toggleClass('active').closest('.cabinet_table').find('.reply_spoiler').toggleClass('hide');
        if (
            $(this).closest('.order_history_table').find('.cabinet_open_review_form').hasClass('active') ||
            $(this).closest('.order_history_table').find('.show_product').hasClass('active')
        ) {
            $(this).closest('.order_history_table').addClass('open');
        } else {
            $(this).closest('.order_history_table').removeClass('open');
        }
        return false;
    });

    $('.cabinet_table .show_product').click(function () {
        $(this).toggleClass('active').closest('.cabinet_table').find('.order_products').toggleClass('hide');
        let lang_span = $(this).find('.goods-title');
        if ($(this).hasClass('active')) {
            lang_span.html(lang_span.data('toggletitle'));
        } else {
            lang_span.html(lang_span.data('title'));
        }
        if (
            $(this).closest('.order_history_table').find('.cabinet_open_review_form').hasClass('active') ||
            $(this).closest('.order_history_table').find('.show_product').hasClass('active')
        ) {
            $(this).closest('.order_history_table').addClass('open');
        } else {
            $(this).closest('.order_history_table').removeClass('open');

        }
        return false;
    });

    if ($('.cabinet_table.with_product').length) {
        $('.cabinet_table.with_product tr').each(function () {
            if ($(window).width() <= 1100) {
                $(this).find('td.col_sale, .col_count, .col_price').wrapAll('<td class="col_adapt_right"><table class="inner_td_block"><tr></tr></table></td>');
            }
        });
    }

    if ($('.init-ui-slider').length) {
        $('.init-ui-slider').each(function () {
            var obj = $(this);
            $(this).slider({
                range: true,
                min: obj.data('min'),
                max: obj.data('max'),
                step: 1,
                values: [obj.parent().find("input.from").val(), obj.parent().find("input.to").val() ? obj.parent().find("input.to").val() : obj.data('max')],
                slide: function (event, ui) {
                    obj.parent().find("input.from").val(ui.values[0]);
                    obj.parent().find("input.to").val(ui.values[1]);
                },
                change: function () {
                    //show_search_link(obj);
                }
            });
        });
    }

    function show_search_link(obj) {
        if ($(window).width() < 920) return true;
        //$.get("?getlink&"+$(form).serialize(), function(data){
        $('#filteredCount').html(3/*data.count*/);

        $('#filteredLink').attr('href', ''/*((data.link ? data.link : $(form).attr('action')+'?'+$(form).serialize())+'#content_ankor')*/);
        $('#filterPointer').css({
            'left': $(obj).offset().left,
            'top': $(obj).offset().top
        }).show();
        //}, 'json');
    }
    $('.rating').rating();
    /* /filters */

    $('.main_tabs .main_tabs_nav ul li a').click(function () {
        $(this).parent().addClass('active').siblings('li').removeClass('active');
        $(this).closest('.main_tabs').children('div.tab').eq($(this).parent().index()).addClass('active').siblings('div').removeClass('active');
        return false;
    });

    $('.main_tabs-small .main_tabs_nav ul li a').click(function () {
        let text = $(this).data('text');
        $('.main_tabs_nav_title').text(text);
        $(this).parent().addClass('active').siblings('li').removeClass('active');
        $(this).closest('.main_tabs').children('div.tab').eq($(this).parent().index()).addClass('active').siblings('div').removeClass('active');
        $('.main_tabs_nav-small-list').hide();
        return false;
    });

    $('.main_tabs_nav_title').click(function () {
        $(this).next().slideToggle(300);
    });

    $('.row.discussion').parent().css({ 'background': 'none', 'padding-top': '15px' });
    $('.row.discussion .main_tabs .main_tabs_nav ul li a').click(function () {
        $(this).parent().addClass('active').siblings('li').removeClass('active');
        $('.content_tabs').children('div.tab').eq($(this).parent().index()).addClass('active').siblings('div').removeClass('active');
        return false;
    });

    $('.row.discussion .main_tabs_nav .revs_on_me').click(function () {
        var count = 0;
        $.get('/cabinet/discussion?ajax=1&reviews=1', function (data) {
            count = Number(data);
            $('.menu_counter.un_rev').each(function () {
                $(this).text(Number($(this).text()) - count);
                if ($(this).text() == '0') $(this).hide()
            })
            $('.menu_counter.discuss').each(function () {
                $(this).text(Number($(this).text()) - count);
                if ($(this).text() == '0') $(this).hide()
            })
        }, 'json');
    })
    $('.show_block_all_comments').click(function () {
        $(this).find('.badge').remove();
        let item_id = Number($(this).find('.comment_item_id').text());
        var count = 0;
        $.get('/cabinet/discussion?ajax=1&item=' + item_id, function (data) {
            count = Number(data);
            $('.menu_counter.un_mes').each(function () {
                $(this).text(Number($(this).text()) - count);
                if ($(this).text() == '0') $(this).hide()
            })
            $('.menu_counter.discuss').each(function () {
                $(this).text(Number($(this).text()) - count);
                if ($(this).text() == '0') $(this).hide()
            })
        }, 'json');
        $(this).hide();
        $(this).closest('.comments_item').find('.target_comments').hide();//target_comments
        $(this).next().slideToggle(50);
    });
    $('.hide_block_all_comments').click(function () {
        $(this).closest('.comments_item').find('.target_comments').show();//target_comments
        $(this).closest('.comments_item').find('.show_block_all_comments').show();
        $(this).parent().slideToggle(50);
    });

    //  $('.row.discussion .main_tabs .main_tabs_nav ul li a').click(function(){
    //     $(this).parent().toggleClass('active').children('.drop').slideToggle(300);
    //     $(this).parent().toggleClass('active').children(".white-wrapper").slideToggle(300);
    //     return false;
    // });


    $('.tab_accardion .tab_accardion_title').click(function () {
        if ($(this).hasClass('active')) {
            $('.tab_accardion .tab_accardion_title').removeClass('active');
            $('.tab_accardion .tab_accardion_content').slideUp(300);
        } else {
            $('.tab_accardion .tab_accardion_title').removeClass('active');
            $('.tab_accardion .tab_accardion_content').slideUp(300);
            $(this).addClass('active');
            $(this).next().slideDown(300);
        }
    });
    function fix_slide_tabs() {
        if ($(window).width() < 768) return;

        var main_tabs_nav_width = 0;
        $('.main_tabs .main_tabs_nav ul li').each(function () { main_tabs_nav_width += $(this).outerWidth(true) });
        $('.main_tabs .main_tabs_nav ul').width(main_tabs_nav_width + 2);
        $('.row.discussion .main_tabs .main_tabs_nav ul').css('width', '');

    }
    $(window).load(function () {
        fix_slide_tabs();
    });
    $(window).resize(function () {
        fix_slide_tabs();
    });


    $('.review_form').on('click', '.reply', function () {
        $(this).closest('.review').children('.reply_content').children('.reply_spoiler').slideToggle(300);
    });

    var review_form_uploading = false;
    $('body').on('submit', '.review_form form', function () {
        if (review_form_uploading) return false;
        review_form_uploading = true;

        var obj = $(this);
        var form = $(this)[0]; // You need to use standard javascript object here
        var formData = new FormData(form);
        $.ajax({
            url: '',
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false,
            success: function (answer) {
                let data = JSON.parse(answer);
                if (data.review) {
                    $(obj).parent().after(data.review);
                    $('.review:eq(0) .rating').rating();
                } else {
                    $(obj).prev().html(data.message);
                }
                $(obj).find('textarea').val('');
                // $(obj).parent().slideToggle(100);
                review_form_uploading = false;
            },
        });
        return false;
    });

    $('body').on('click', '.attach_img', function () {
        $(this).closest('form').find('.field__image').slideToggle(300);
        return false;
    });

    $('body').on('submit', '.cabinet_page form.review_form', function () {
        if (review_form_uploading) return false;
        review_form_uploading = true;
        var obj = $(this);
        var form = $(this)[0]; // You need to use standard javascript object here
        var formData = new FormData(form);
        $.ajax({
            url: '',
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false,
            success: function (answer) {
                let data = JSON.parse(answer);
                if (data.status == 'error') {
                    $(obj).prev().html(data.message);
                } else {
                    if (data.review) {
                        $(obj).prev().html(data.message);
                    } else {
                        $(obj).prev().html(data.message);
                    }
                    $(obj).hide();
                }
                review_form_uploading = false;
            },
        });
        return false;
    });

    $('.comments_block').on('click', '.reply_footer .review_question', function () {
        var current_review = $(this).closest('.reply_content');
        if (current_review.hasClass('reviewing')) return;
        current_review.addClass('reviewing');

        var form_for_rev = current_review.closest('.comments_item').find('form');
        let comments_item = $(this).closest('.comments_item');

        let form_for_rev_html = form_for_rev.closest('.reply_spoiler').html();
        current_review.after(form_for_rev_html);

        let answer_form = current_review.next().next();

        answer_form.find('.answer_from').val(current_review.data('parentid'));
        answer_form.find('.comment_number').val(current_review.data('commentnumber'));
        answer_form.find('.for_username').val(current_review.data('foruser'));
        answer_form.find('.for_who').val(current_review.data('forwho'));

        // let form_for_rev_html = form_for_rev.closest('.reply_spoiler').html();
        // current_review.after(form_for_rev_html);

        //comments_item.find('textarea').css('height','90px');
        answer_form.find('textarea').focus();
        //comments_item.find('.for_who_output').text(for_who_name);
        comments_item.find('form').css('padding-bottom', '15px');
    });

    $('.comments_block2').on('click', '.reply_footer .review_question', function () {
        var current_review = $(this).closest('.reply_content');
        if (current_review.hasClass('reviewing')) return;
        current_review.addClass('reviewing');

        var form_for_rev = current_review.closest('.comments_item').find('form');
        let comments_item = $(this).closest('.comments_item');

        let form_for_rev_html = form_for_rev.closest('.reply_spoiler').html();
        current_review.after(form_for_rev_html);

        let answer_form = current_review.next().next();

        answer_form.find('.answer_from').val(current_review.data('parentid'));
        answer_form.find('.comment_number').val(current_review.data('commentnumber'));
        answer_form.find('.for_username').val(current_review.data('foruser'));
        answer_form.find('.for_who').val(current_review.data('forwho'));

        // let form_for_rev_html = form_for_rev.closest('.reply_spoiler').html();
        // current_review.after(form_for_rev_html);

        //comments_item.find('textarea').css('height','90px');
        answer_form.find('textarea').focus();
        //comments_item.find('.for_who_output').text(for_who_name);
        comments_item.find('form').css('padding-bottom', '15px');
    });

    $('.cabinet_page .discussion textarea').focus(function () {
        $(this).css('height', '90px');
    });

    $('.cabinet_page .discussion textarea').focusout(function () {
        $(this).css('height', '');
    });


    $('body').on('click', '.cabinet_page .comments_item .like_submit', function () {
        if (review_form_uploading) return false;
        review_form_uploading = true;

        var obj = $(this).closest('form');
        var form = $(obj)[0]; // You need to use standard javascript object here
        var formData = new FormData(form);
        $.ajax({
            url: '',
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false,
            success: function (answer) {
                let data = JSON.parse(answer);
                if (data.status == 'error') {
                    $(obj).prev().html(data.message);
                } else {
                    var rev = data.review;
                    let comment_id = rev.comment_number;
                    let posted = false;
                    obj.closest('.comments_item').find('.parent_comment').find('.reply_content').each(function () {
                        if ($(this).data('commentnumber') == comment_id || (!posted && comment_id == 0)) {
                            let className = comment_id == 0 ? 'parent_comment new_comment' : 'child_comment new_comment';
                            let commentSelector = comment_id == 0 ? obj.closest('.reply_spoiler ').prev() : $(this);
                            console.log(comment_id, $(commentSelector));
                            if (comment_id != 0) obj.hide();
                            //comment_id = 10000;
                            commentSelector
                                .after($('<div>', { 'class': className })
                                    .append($('<div>', { 'class': 'review' })
                                        .append($('<div>', { "class": 'reply_content' })
                                            .append($('<span>', { "class": 'ava' })
                                                .append($('<img>', { "src": rev.img })),
                                                $('<div>', { "class": 'text' })
                                                    .append(
                                                        $('<div>', { "class": 'reply_author', "text": rev.user }),
                                                        $('<div>', { "class": 'reply_text' }).append(
                                                            $('<span>', { "class": 'for_who', "text": rev.for_who ? rev.for_who + ', ' : '' }),
                                                            $('<span>', { "text": rev.message })
                                                        ),
                                                        (rev.upload_images ? $('<div>', { "class": 'reply_images' }).append(rev.upload_images) : ''),
                                                        $('<div>', { "class": 'reply_footer' }).append(
                                                            $('<span>', { "class": 'date', "text": 'только что' })
                                                        )
                                                    )
                                            ))
                                    )
                                );
                            posted = true;
                        }
                    });


                    $(obj).find('textarea').val('');

                    let comment_number = obj.find('input[name=comment_number]').val();
                    $('div[data-commentnumber="' + comment_number + '"]').removeClass('reviewing');
                }
                review_form_uploading = false;
            },
        });
        return false;
    });

    $('.slick_slider').each(function () {
        const rows = $(this).data('rows') ? parseInt($(this).data('rows')) : 1;
        const slidesToShowXS = $(this).data('slide-xs') ? parseFloat($(this).data('slide-xs')) : 4;
        const slidesToShowMD = $(this).data('slide-md') ? parseFloat($(this).data('slide-md')) : 3;
        const slidesToShowSM = $(this).data('slide-sm') ? parseFloat($(this).data('slide-sm')) : 1;
        $(this).slick({
            dots: false,
            infinite: true,
            speed: 300,
            slidesToShow: slidesToShowXS,
            slidesToScroll: 1,
            rows: $(window).width() > 768 ? rows : 1,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: slidesToShowMD,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: slidesToShowSM,
                        slidesToScroll: 1,
                        arrows: false,
                    }
                }
            ]
        });
    })

    if ($('.product_page .product_col_img img').length > 1 && $(window).width() < 550) {
        $('.product_page .product_col_img .row a').unwrap().unwrap()
        $('.product_page .product_col_img').slick({
            dots: false,
            arrows: false,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
        });
        $('.product_page .product_col_img .slick-cloned').removeAttr('data-fancybox');
        $(window).load(function () {
            $('.product_page .product_col_img img').each(function () {
                if ($(this).data('medium')) {
                    $(this).attr('src', $(this).data('medium'));
                }
            })
        })
    }


    // var old_window_width = $(window).width();

    // if ($('.main_block .pop_cats .bxslider').length) {// на главной
    //     var pop_cats;
    //     initPopcatsSlider();
    //     function initPopcatsSlider() {
    //         var pop_cats_visible = 5,
    //             pop_cats_width = 50;

    //         if ($(window).width() >= 1050) {
    //             pop_cats_visible = 5;
    //         } else if ($(window).width() >= 820) {
    //             pop_cats_visible = 4;
    //             //}else if($(window).width() >= 600){
    //             //     pop_cats_visible = 3;
    //             // }else if($(window).width() >= 450){
    //             //     pop_cats_visible = 2;
    //         } else {
    //             pop_cats_visible = 3;
    //         }
    //         pop_cats_width = $('.main_block .pop_cats .bxslider').width() / pop_cats_visible;

    //         pop_cats = $('.main_block .pop_cats .bxslider').bxSlider({
    //             speed: 1000,
    //             auto: false,
    //             pager: true,
    //             controls: true,
    //             touchEnabled: false,
    //             oneToOneTouch: false,
    //             adaptiveHeight: true,

    //             minSlides: pop_cats_visible,
    //             maxSlides: pop_cats_visible,
    //             moveSlides: pop_cats_visible,
    //             slideWidth: pop_cats_width
    //         });
    //     }
    //     $(window).resize(function () {
    //         //pop_cats.destroySlider();
    //         //initPopcatsSlider();
    //         if (old_window_width != $(window).width()) location.reload();
    //     });
    // }

    // if ($('.main_block.in_main .pop_products .bxslider').length) {// на главной
    //     var pop_products = [];

    //     initPopProductsSlider();
    //     function initPopProductsSlider() {
    //         $('.main_block.in_main .pop_products .bxslider').children('.bxslider_page').children().unwrap();
    //         $('.main_block.in_main .pop_products .bxslider').children('.row').children().unwrap();

    //         var pop_products_visible = 8;

    //         if ($(window).width() >= 992) {
    //             pop_products_visible = 8;
    //         } else if ($(window).width() >= 768) {
    //             pop_products_visible = 6;
    //             // }else if($(window).width() >= 550){
    //             //     pop_products_visible = 2;
    //         } else {
    //             pop_products_visible = 2;
    //         }


    //         pop_products = [];
    //         $('.main_block.in_main .pop_products .bxslider').each(function () {
    //             var $set = $(this).children();
    //             //console.log($set.html()+ " this set");
    //             for (var i = 0, len = $set.length; i < len; i += pop_products_visible) {
    //                 $set.slice(i, i + pop_products_visible).wrapAll('<div class="row"/>');
    //             }
    //             $(this).children('.row').wrap('<div class="bxslider_page"/>');

    //             pop_products.push($(this).bxSlider({
    //                 speed: 1000,
    //                 auto: false,
    //                 pager: false,
    //                 controls: true,
    //                 touchEnabled: false,
    //                 oneToOneTouch: false,
    //                 adaptiveHeight: true,
    //             }));
    //         });


    //     }



    //     $(window).resize(function () {
    //         /*$.each(pop_products, function(key, item){
    //             item.destroySlider();
    //         });
    //         initPopProductsSlider();*/
    //         if (old_window_width != $(window).width()) location.reload();
    //     });
    // }


    // if ($('.main_block.recommend .pop_products .bxslider').length) {// в карточке
    //     var recommend_slider;
    //     initRecommendSlider();
    //     function initRecommendSlider() {
    //         var recommend_slider_visible = 5,
    //             recommend_slider_width = 50;

    //         if ($(window).width() >= 992) {
    //             recommend_slider_visible = 4;
    //         } else if ($(window).width() >= 768) {
    //             recommend_slider_visible = 3;
    //             // }else if($(window).width() >= 550){
    //             //     recommend_slider_visible = 2;
    //         } else {
    //             recommend_slider_visible = 2;
    //         }
    //         recommend_slider_width = $('.main_block .pop_products .bxslider').width() / recommend_slider_visible;

    //         recommend_slider = $('.main_block .pop_products .bxslider').bxSlider({
    //             speed: 1500,
    //             auto: false,
    //             pager: true,
    //             controls: true,
    //             touchEnabled: false,
    //             oneToOneTouch: false,
    //             adaptiveHeight: true,

    //             minSlides: recommend_slider_visible,
    //             maxSlides: recommend_slider_visible,
    //             moveSlides: recommend_slider_visible,
    //             slideWidth: recommend_slider_width
    //         });
    //     }
    //     $(window).resize(function () {
    //         //recommend_slider.destroySlider();
    //         //initRecommendSlider();
    //         if (old_window_width != $(window).width()) location.reload();
    //     });
    // }

    $('.input_number a').click(function () {
        var count = parseInt($(this).closest('.input_number').children('input').val());
        let min_number = $(this).closest('.input_number').children('input').hasClass('to_promote') ? 0 : 1;

        var new_count = count + ($(this).hasClass('up') ? 1 : -1);
        if (new_count < min_number || isNaN(new_count)) new_count = min_number;
        $(this).closest('.input_number').children('input').val(new_count).keyup();
        return false;
    });

    function changeSumm(node) {
        let sc_comission = node.closest('.input_number').attr('data-comission');
        let selector = node.closest('.input_number').attr('data-sc');
        let price = parseInt(node.closest('.input_number').parent().next().next().find('.price').text());

        $('.safecrow_total').each(function () { //Итого, сюда пишем новое значение
            if ($(this).attr('data-sc') == selector) {
                $(this).text(Math.round(price * sc_comission * 100) / 100);
            }
        });
    }

    $('.input_number input').keyup(function () {
        var new_count = parseInt($(this).val());
        let min_number = $(this).hasClass('to_promote') ? 0 : 1;
        if (new_count < min_number || isNaN(new_count)) new_count = min_number;
        $(this).val(new_count);
        var obj = $(this);
        if (obj.hasClass('to_promote')) {
            let total_price = obj.closest('.cabinet_dop_item').find('.buy_total_price')
            total_price.html(Math.round($(total_price).data('mult') * new_count))
        }
        if ($(this).closest('.product_page').length) {
            if (new_count > $(this).parent().data('max')) {
                alert('Товара нет в наличии');
                $(this).val($(this).parent().data('max'));
            }
            return true;
        }
        setTimeout(changeSumm, 200, $(this));

        $.get($(this).parent().prev().attr('href') + '&ajax=1&count=' + new_count, function (data) {
            if (data.status == 'success') {
                update_basket_info(data.data.count, data.data.suff, data.data.summ, data.data.sale, data.data.delivery, data.data.total + data.data.scTotal, data.data.scTotal, data.data.rate, data.data.delirate);
                if ($(obj).closest('.basket_table').length) {
                    var summ = parseFloat($(obj).closest('tr').children('.col_price').find('.price_val').html().replace(" ", "").replace("&nbsp;", "")) * new_count;
                    $(obj).closest('tr').children('.col_summ').children('.price').html(Math.round(summ * 100) / 100 + ` <r style="font-family: 'rouble'">e</r>`)
                }
            } else {
                alert(data.error);
                $(obj).val(data.max_count);
                $(obj).keyup();
            }
        }, 'json');


    });


    // $('.onlynum').keyup(function(){
    //     var new_count = parseFloat($(this).val());
    //     if(new_count<0 || isNaN(new_count)) new_count = 1;
    //     $(this).val(new_count);
    // });

    $('.payForm__eachInput input, .payForm__eachInput textarea').each(function () {
        if ($(this).val() != '') {
            $(this).parent().addClass('field_active');
            $(this).scrollTop(0);
        }
    });

    $('.page').on('keyup', '.payForm__eachInput input, .payForm__eachInput textarea', function () {
        if ($(this).val() != '') {
            $(this).parent().addClass('field_active');
        } else {
            if (!$(this).parent().hasClass('field_active_always')) {
                $(this).parent().removeClass('field_active');
            }

        }
    });

    $('.payForm__eachInput textarea').scroll(function () {
        if ($(this).scrollTop() > 0) {
            $(this).prev().css('opacity', 0);
        } else {
            $(this).prev().css('opacity', 1);
        }
    });


    $('.cabinet_page').on('change', '.product_change_cat_vk', function () {
        var obj = $(this),
            target = $(this).closest('.payForm__eachInput').next().removeClass('hide').find('.ajax_cnt');
        var catid = $(this).data('catid')
        $.post('', { getChildNode: $(this).val() }, function (data) {
            if (data) {
                $(target).html('<select data-catid="' + catid + '" name="cat[' + catid + ']" ' + ($(obj).hasClass('first_cat') ? 'class="product_change_cat_vk"' : '') + '>' + data + '</select>');
                $(target).find('select').select2();
                if ($(obj).hasClass('first_cat')) {
                    $(obj).closest('.catalog_nodes_selects_cnt_vk').find('.ajax_cnt.third_cat').html('').parent().addClass('hide');
                }
            } else {
                $(target).html('').parent().addClass('hide');
                if ($(obj).hasClass('first_cat')) {
                    $('.ajax_cnt.third_cat').html('').parent().addClass('hide');
                }
            }
        });
    });

    $('.cabinet_page').on('change', '.catalog_nodes_selects_cnt_vk select', function () {
        //update_filters
        var nodes = [
            $('.product_change_cat_vk.first_cat').val(),
            $('.ajax_cnt.second_cat select').val(),
            $('.ajax_cnt.third_cat select').val()
        ];
        $.post('', { getFiltersNode: nodes }, function (data) {
            if (data) {
                $('.cabinet_filters_cnt').html(data);
                $('.cabinet_filters_cnt select').select2();
            } else {
                $('.cabinet_filters_cnt').html('');
            }
        });
    });


    $('.cabinet_page').on('change', '.product_change_cat', function () {
        var obj = $(this),
            target = $(this).closest('.payForm__eachInput').next().removeClass('hide').find('.ajax_cnt');
        $.post('', { getChildNode: $(this).val() }, function (data) {
            if (data) {
                $(target).html('<select name="node[]" ' + ($(obj).hasClass('first_cat') ? 'class="product_change_cat"' : '') + '>' + data + '</select>');
                $(target).find('select').select2();
                if ($(obj).hasClass('first_cat')) {
                    $('.ajax_cnt.third_cat').html('').parent().addClass('hide');
                }
                if ($(obj).parent().hasClass('second_cat') && product_add_autoselect_third_cat) {
                    $('.third_cat').find("select").val(product_add_autoselect_third_cat);
                    $('.third_cat').find("select").trigger('change');
                    product_add_autoselect_third_cat = '';
                }
            } else {
                $(target).html('').parent().addClass('hide');
                if ($(obj).hasClass('first_cat')) {
                    $('.ajax_cnt.third_cat').html('').parent().addClass('hide');
                }
            }
        });
    });

    $('.cabinet_page').on('change', '.catalog_nodes_selects_cnt select', function () {
        //update_filters
        var obj = $(this);
        const nodes = [
            $('.product_change_cat.first_cat').val(),
            $('.ajax_cnt.second_cat select').val(),
            $('.ajax_cnt.third_cat select').val()
        ];
        $.post('', { getFiltersNode: nodes }, function (data) {
            if (data) {
                $('.cabinet_filters_cnt').html(data);
                $('.cabinet_filters_cnt select').select2();
                // автозаполнение
                if ($(obj).parent().hasClass('third_cat') && product_add_set_filter_values) {
                    changeMTGFilters(product_add_set_filter_values);
                }
            } else {
                $('.cabinet_filters_cnt').html('');
            }
        });
    });

    $(document).on('click', '.field__image__row .uploded_img .remove', function () {
        var obj = $(this);
        $.get($(this).attr('href') + '&ajax', function () {
            let inputIndex = obj.data('index');
            if (inputIndex !== undefined && inputIndex !== '') {
                $(obj).closest('form').find('.file_upload[data-index=' + inputIndex + ']').remove();
            }
            obj.closest('.uploded_img').remove();
        });
        return false;
    });

    $(document).on('click', '.field__image__row .uploded_img .main', function () {
        var obj = $(this);
        $.get($(this).attr('href') + '&ajax', function () {
            let inputIndex = obj.data('index');

            if (inputIndex !== undefined && inputIndex !== '') {
                $(obj).closest('form').find('.field__image__input__row').prepend($(obj).closest('form').find('.file_upload[data-index="' + inputIndex + '"]').closest('.file_upload'));
            }

            $(obj).closest('form').find('.field__image__row').prepend($(obj).closest('.uploded_img'));
        });
        return false;
    });

    $('.filter_country').change(function () {
        $(this).closest('.filter_multicheckbox').find('label').addClass('hide');
        $(this).closest('.filter_multicheckbox').find('label.region_' + $(this).val()).removeClass('hide');
    });

});
jQuery.fn.addBack = jQuery.fn.andSelf;

//rating extend
$.fn.rating = function (settings) {
    //attr: disabled - РІРѕР·РјРѕР¶РЅРѕСЃС‚СЊ РјРµРЅСЏС‚СЊ
    //      value    - РЅР°С‡Р°Р»СЊРЅРѕРµ Р·РЅР°С‡РµРЅРёРµ
    var defaults_options = {
        max: 5,
        onClick: function () { }
    }
    const options = $.extend({}, defaults_options, settings);//РјР°СЃСЃРёРІ РІС…РѕРґ РїР°СЂР°РјРµС‚СЂРѕРІ
    //init
    $(this).each(function () {
        var value = parseInt($(this).val()); if (!value) value = 0; if (value > options.max) value = options.max;
        $(this).wrap('<div class="rating_conteiner">');
        for (let i = 1; i <= options.max; i++) $(this).parent().append('<a href="#" class="rating_star' + ((i <= value) ? ' checked' : '') + ($(this).is(':disabled') ? ' disabled' : '') + '"></a>');
    });
    //events
    $(this).parent().find('.rating_star').not('.disabled')
        .bind("click", function () {
            var input = $(this).parent().children('input');
            $(input).val($(this).index());
            $(input).change();
            if (options.onClick) {
                options.onClick($(input));
            }
            return false;
        })
        .bind("mouseenter", function () {
            $(this).parent().find('.rating_star').removeClass('checked').eq($(this).index() - 1).addClass('checked').prevAll(".rating_star").addClass('checked');
        })
        .bind("mouseleave", function () {
            var input = $(this).parent().children('input');
            $(this).parent().find('.rating_star').removeClass('checked');
            if ($(input).val()) $(this).parent().find('.rating_star').eq($(input).val() - 1).addClass('checked').prevAll(".rating_star").addClass('checked');
        });
}
// /rating extend

function number_format(number, decimals, dec_point, thousands_sep) {
    number = number * 1;//makes sure `number` is numeric value
    var str = number.toFixed(decimals ? decimals : 0).toString().split('.');
    var parts = [];
    for (var i = str[0].length; i > 0; i -= 3) {
        parts.unshift(str[0].substring(Math.max(0, i - 3), i));
    }
    str[0] = parts.join(thousands_sep ? thousands_sep : ',');
    return str.join(dec_point ? dec_point : '.');
}


//jQuery mask
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var ua = navigator.userAgent,
        iPhone = /iphone/i.test(ua),
        chrome = /chrome/i.test(ua),
        android = /android/i.test(ua),
        caretTimeoutId;

    $.mask = {
        //Predefined character definitions
        definitions: {
            '#': "[0-9]",
            'a': "[A-Za-z]",
            '*': "[A-Za-z0-9]"
        },
        autoclear: true,
        dataName: "rawMaskFn",
        placeholder: ' '
    };

    $.fn.extend({
        //Helper Function for Caret positioning
        caret: function (begin, end) {
            var range;

            if (this.length === 0 || this.is(":hidden") || this.get(0) !== document.activeElement) {
                return;
            }

            if (typeof begin == 'number') {
                end = (typeof end === 'number') ? end : begin;
                return this.each(function () {
                    if (this.setSelectionRange) {
                        this.setSelectionRange(begin, end);
                    } else if (this.createTextRange) {
                        range = this.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', end);
                        range.moveStart('character', begin);
                        range.select();
                    }
                });
            } else {
                if (this[0].setSelectionRange) {
                    begin = this[0].selectionStart;
                    end = this[0].selectionEnd;
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                    begin = 0 - range.duplicate().moveStart('character', -100000);
                    end = begin + range.text.length;
                }
                return { begin: begin, end: end };
            }
        },
        unmask: function () {
            return this.trigger("unmask");
        },
        mask: function (mask, settings) {
            var input,
                defs,
                tests,
                partialPosition,
                firstNonMaskPos,
                lastRequiredNonMaskPos,
                len,
                oldVal;

            if (!mask && this.length > 0) {
                input = $(this[0]);
                var fn = input.data($.mask.dataName)
                return fn ? fn() : undefined;
            }

            settings = $.extend({
                autoclear: $.mask.autoclear,
                placeholder: $.mask.placeholder, // Load default placeholder
                completed: null
            }, settings);


            defs = $.mask.definitions;
            tests = [];
            partialPosition = len = mask.length;
            firstNonMaskPos = null;

            mask = String(mask);

            $.each(mask.split(""), function (i, c) {
                if (c == '?') {
                    len--;
                    partialPosition = i;
                } else if (defs[c]) {
                    tests.push(new RegExp(defs[c]));
                    if (firstNonMaskPos === null) {
                        firstNonMaskPos = tests.length - 1;
                    }
                    if (i < partialPosition) {
                        lastRequiredNonMaskPos = tests.length - 1;
                    }
                } else {
                    tests.push(null);
                }
            });

            return this.trigger("unmask").each(function () {
                var input = $(this),
                    buffer = $.map(
                        mask.split(""),
                        function (c, i) {
                            if (c != '?') {
                                return defs[c] ? getPlaceholder(i) : c;
                            }
                        }),
                    defaultBuffer = buffer.join(''),
                    focusText = input.val();

                function tryFireCompleted() {
                    if (!settings.completed) {
                        return;
                    }

                    for (var i = firstNonMaskPos; i <= lastRequiredNonMaskPos; i++) {
                        if (tests[i] && buffer[i] === getPlaceholder(i)) {
                            return;
                        }
                    }
                    settings.completed.call(input);
                }

                function getPlaceholder(i) {
                    if (i < settings.placeholder.length)
                        return settings.placeholder.charAt(i);
                    return settings.placeholder.charAt(0);
                }

                function seekNext(pos) {
                    while (++pos < len && !tests[pos]);
                    return pos;
                }

                function seekPrev(pos) {
                    while (--pos >= 0 && !tests[pos]);
                    return pos;
                }

                function shiftL(begin, end) {
                    var i,
                        j;

                    if (begin < 0) {
                        return;
                    }

                    for (i = begin, j = seekNext(end); i < len; i++) {
                        if (tests[i]) {
                            if (j < len && tests[i].test(buffer[j])) {
                                buffer[i] = buffer[j];
                                buffer[j] = getPlaceholder(j);
                            } else {
                                break;
                            }

                            j = seekNext(j);
                        }
                    }
                    writeBuffer();
                    input.caret(Math.max(firstNonMaskPos, begin));
                }

                function shiftR(pos) {
                    var i,
                        c,
                        j,
                        t;

                    for (i = pos, c = getPlaceholder(pos); i < len; i++) {
                        if (tests[i]) {
                            j = seekNext(i);
                            t = buffer[i];
                            buffer[i] = c;
                            if (j < len && tests[j].test(t)) {
                                c = t;
                            } else {
                                break;
                            }
                        }
                    }
                }

                function androidInputEvent(e) {
                    var curVal = input.val();
                    var pos = input.caret();
                    if (oldVal && oldVal.length && oldVal.length > curVal.length) {
                        // a deletion or backspace happened
                        checkVal(true);
                        while (pos.begin > 0 && !tests[pos.begin - 1])
                            pos.begin--;
                        if (pos.begin === 0) {
                            while (pos.begin < firstNonMaskPos && !tests[pos.begin])
                                pos.begin++;
                        }
                        input.caret(pos.begin, pos.begin);
                    } else {
                        var pos2 = checkVal(true);
                        var lastEnteredValue = curVal.charAt(pos.begin);
                        if (pos.begin < len) {
                            if (!tests[pos.begin]) {
                                pos.begin++;
                                if (tests[pos.begin].test(lastEnteredValue)) {
                                    pos.begin++;
                                }
                            } else {
                                if (tests[pos.begin].test(lastEnteredValue)) {
                                    pos.begin++;
                                }
                            }
                        }
                        input.caret(pos.begin, pos.begin);
                    }
                    tryFireCompleted();
                }


                function blurEvent(e) {
                    checkVal();

                    if (input.val() != focusText)
                        input.change();
                }

                function keydownEvent(e) {
                    if (input.prop("readonly")) {
                        return;
                    }

                    var k = e.which || e.keyCode,
                        pos,
                        begin,
                        end;
                    oldVal = input.val();
                    //backspace, delete, and escape get special treatment
                    if (k === 8 || k === 46 || (iPhone && k === 127)) {
                        pos = input.caret();
                        begin = pos.begin;
                        end = pos.end;

                        if (end - begin === 0) {
                            begin = k !== 46 ? seekPrev(begin) : (end = seekNext(begin - 1));
                            end = k === 46 ? seekNext(end) : end;
                        }
                        clearBuffer(begin, end);
                        shiftL(begin, end - 1);

                        e.preventDefault();
                    } else if (k === 13) { // enter
                        blurEvent.call(this, e);
                    } else if (k === 27) { // escape
                        input.val(focusText);
                        input.caret(0, checkVal());
                        e.preventDefault();
                    }
                }

                function keypressEvent(e) {
                    if (input.prop("readonly")) {
                        return;
                    }

                    var k = e.which || e.keyCode,
                        pos = input.caret(),
                        p,
                        c,
                        next;

                    if (e.ctrlKey || e.altKey || e.metaKey || k < 32) {//Ignore
                        return;
                    } else if (k && k !== 13) {
                        if (pos.end - pos.begin !== 0) {
                            clearBuffer(pos.begin, pos.end);
                            shiftL(pos.begin, pos.end - 1);
                        }

                        p = seekNext(pos.begin - 1);
                        if (p < len) {
                            c = String.fromCharCode(k);
                            if (tests[p].test(c)) {
                                shiftR(p);

                                buffer[p] = c;
                                writeBuffer();
                                next = seekNext(p);

                                if (android) {
                                    //Path for CSP Violation on FireFox OS 1.1
                                    var proxy = function () {
                                        $.proxy($.fn.caret, input, next)();
                                    };

                                    setTimeout(proxy, 0);
                                } else {
                                    input.caret(next);
                                }
                                if (pos.begin <= lastRequiredNonMaskPos) {
                                    tryFireCompleted();
                                }
                            }
                        }
                        e.preventDefault();
                    }
                }

                function clearBuffer(start, end) {
                    var i;
                    for (i = start; i < end && i < len; i++) {
                        if (tests[i]) {
                            buffer[i] = getPlaceholder(i);
                        }
                    }
                }

                function writeBuffer() { input.val(buffer.join('')); }

                function checkVal(allow) {
                    //try to place characters where they belong
                    var test = input.val(),
                        lastMatch = -1,
                        i,
                        c,
                        pos;

                    for (i = 0, pos = 0; i < len; i++) {
                        if (tests[i]) {
                            buffer[i] = getPlaceholder(i);
                            while (pos++ < test.length) {
                                c = test.charAt(pos - 1);
                                if (tests[i].test(c)) {
                                    buffer[i] = c;
                                    lastMatch = i;
                                    break;
                                }
                            }
                            if (pos > test.length) {
                                clearBuffer(i + 1, len);
                                break;
                            }
                        } else {
                            if (buffer[i] === test.charAt(pos)) {
                                pos++;
                            }
                            if (i < partialPosition) {
                                lastMatch = i;
                            }
                        }
                    }
                    if (allow) {
                        writeBuffer();
                    } else if (lastMatch + 1 < partialPosition) {
                        if (settings.autoclear || buffer.join('') === defaultBuffer) {
                            // Invalid value. Remove it and replace it with the
                            // mask, which is the default behavior.
                            if (input.val()) input.val("");
                            clearBuffer(0, len);
                        } else {
                            // Invalid value, but we opt to show the value to the
                            // user and allow them to correct their mistake.
                            writeBuffer();
                        }
                    } else {
                        writeBuffer();
                        input.val(input.val().substring(0, lastMatch + 1));
                    }
                    return (partialPosition ? i : firstNonMaskPos);
                }

                input.data($.mask.dataName, function () {
                    return $.map(buffer, function (c, i) {
                        return tests[i] && c != getPlaceholder(i) ? c : null;
                    }).join('');
                });


                input
                    .one("unmask", function () {
                        input
                            .off(".mask")
                            .removeData($.mask.dataName);
                    })
                    .on("focus.mask", function () {
                        if (input.prop("readonly")) {
                            return;
                        }

                        clearTimeout(caretTimeoutId);
                        var pos;

                        focusText = input.val();

                        pos = checkVal();

                        caretTimeoutId = setTimeout(function () {
                            if (input.get(0) !== document.activeElement) {
                                return;
                            }
                            writeBuffer();
                            if (pos == mask.replace("?", "").length) {
                                input.caret(0, pos);
                            } else {
                                input.caret(pos);
                            }
                        }, 10);
                    })
                    .on("blur.mask", blurEvent)
                    .on("keydown.mask", keydownEvent)
                    .on("keypress.mask", keypressEvent)
                    .on("input.mask paste.mask", function () {
                        if (input.prop("readonly")) {
                            return;
                        }

                        setTimeout(function () {
                            var pos = checkVal(true);
                            input.caret(pos);
                            tryFireCompleted();
                        }, 0);
                    });
                if (chrome && android) {
                    input
                        .off('input.mask')
                        .on('input.mask', androidInputEvent);
                }
                checkVal(); //Perform initial check for existing values
            });
        }
    });
}));

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

jQuery.cookie = function (name, value, options, safecrowCoockie) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        if (safecrowCoockie) path = '; path=/';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

function in_array(needle, haystack, strict) {   // Checks if a value exists in an array
    var found = false, key, strict = !!strict;
    for (key in haystack) {

        if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
            found = true;
            break;
        }
    }
    return found;
}


// var localization_err_msg_lng = {
//     field: 'Поле',
//     required: "обязательно для заполнения",
//     incorrect: "заполнено некорректно",
//     only_numbers: "заполнено некорректно. Только цифры",
//     summ: 'заполнено некорректно. Может содержать только цифры и знак "."',
//     date: 'заполнено некорректно (дд.мм.гггг)',
//     url: 'заполнено некорректно, формат http://site.ru',
//     phone: 'заполнено некорректно, формат +_ (___) ___-__-__',
//     price_bliz: 'должно быть больше стартовой цены или 0',
// };

// function removeFieldError(field) {
//     $(field).removeClass('error');
//     $(field).siblings('div.error').remove();
//     if ($(field).data('multipleerr')) $(field).closest('.fieldset').find('.error.' + $(field).attr('name')).remove();
//     if ($(field).prop("tagName") == 'SELECT') {
//         $(field).next().removeClass('error');
//     }
// }

// function setFieldError(field, message) {
//     if ($(field).prop("tagName") == 'SELECT') {
//         $(field).next().addClass('error');
//         $(field).parent().append('<div class="error">' + message + '</div>');
//     } else {
//         $(field).addClass('error');
//         if ($(field).data('multipleerr')) {
//             $(field).closest('.fieldset').append('<div class="error ' + $(field).attr('name') + '">' + localization_err_msg_lng.field + ' &laquo;' + $(field).attr('placeholder') + '&raquo; ' + message + '</div>');
//         } else {
//             if (!$(field).data('hideerr')) {
//                 if ($(field).attr('type') == 'checkbox') {
//                     $(field).next().after('<div class="error">' + message + '</div>');
//                 } else {
//                     $(field).parent().append('<div class="error">' + message + '</div>');
//                 }

//             }
//         }
//     }

//     return false;
// }

(function ($) {
    $.fn.validate = function () {
        if (this.length == 0) return false;

        var localization_lng = {
            low_bliz: 'Блиц цена должна быть больше резервной цены',
            high_reserv: 'Резервная цена должна быть меньше блиц цены',
            field: 'Поле',
            required: "обязательно для заполнения",
            incorrect: "заполнено некорректно",
            only_numbers: "заполнено некорректно. Только цифры",
            summ: 'заполнено некорректно. Может содержать только цифры и знак "."',
            date: 'заполнено некорректно (дд.мм.гггг)',
            url: 'заполнено некорректно, формат http://site.ru',
            phone: 'заполнено некорректно, формат +_ (___) ___-__-__',
            price_bliz: 'должно быть больше стартовой цены или 0',
            city_min_length: 'заполнено некорректно. Введите минимум 2 символа для поиска городов!',
            city_incorrect_name: 'заполнено некорректно. Город не найден. Напишите нам admin@minifreemarket.com',
            city_empty_region: 'заполнено некорректно. Не выбран регион для поиска городов!',
            userAlias: 'заполнено некорректно. Адрес может содержать английские и русские буквы, цифры и символ тире.',
        }

        if ($('header .control_item .val.active').length && $('header .control_item .val.active').html() == 'ENG') {
            localization_lng.low_bliz = 'The blitz price must be higher than the reserve price';
            localization_lng.high_reserv = 'The reserve price should be less than the blitz price';
            localization_lng.field = 'Field';
            localization_lng.required = 'is required';
            localization_lng.incorrect = 'is incorrect';
            localization_lng.phone = 'is incorrect, format +_ (___) ___-__-__';
            localization_lng.city_min_length = 'is incorrect, minimum length is 2 letters!';
            localization_lng.city_incorrect_name = 'is incorrect, city not found!';
            localization_lng.city_empty_region = 'is incorrect, region is not selected!';
        }

        var removeError = function (field) {
            $(field).removeClass('error');
            $(field).siblings('div.error').remove();
            if ($(field).data('multipleerr')) $(field).closest('.fieldset').find('.error.' + $(field).attr('name')).remove();
            if ($(field).prop("tagName") == 'SELECT') {
                $(field).next().removeClass('error');
            }
        };
        var setError = function (field, message) {
            if ($(field).prop("tagName") == 'SELECT') {
                $(field).next().addClass('error');
                $(field).parent().append('<div class="error">' + localization_lng.field + ' ' + message + '</div>');
            } else {
                $(field).addClass('error');
                if ($(field).data('multipleerr')) {
                    $(field).closest('.fieldset').append('<div class="error ' + $(field).attr('name') + '">' + localization_lng.field + ' &laquo;' + $(field).attr('placeholder') + '&raquo; ' + message + '</div>');
                } else {
                    if (!$(field).data('hideerr')) {
                        if ($(field).attr('type') == 'checkbox') {
                            $(field).next().after('<div class="error">' + localization_lng.field + ' ' + message + '</div>');
                        } else {
                            $(field).parent().append('<div class="error">' + localization_lng.field + ' ' + message + '</div>');
                        }

                    }
                }
            }

            return false;
        };
        var validField = function (field) {
            removeError(field);
            if (!$(field).closest('.hide').length) {
                var val = $(field).val();
                if ($(field).data('req') && ($(field).attr('type') == 'checkbox' ? !$(field).is(':checked') : (!val || val == "0"))) return setError(field, localization_lng.required);
                if (($(field).data('valid') == 'price_bliz' || $(field).data('valid') == 'price_reserv') && (val == "0")) {
                    removeError($('input[name=price_reserv]'));
                    removeError($('input[name=price_bliz]'));
                    return true
                }
                if ($(field).data('valid') && (val != '' && val != "0")) {
                    switch ($(field).data('valid')) {
                        case 'userAlias':
                            if (val.search(/^[a-zA-Z0-9А-Яа-я\-]+$/i) != 0) return setError(field, localization_lng.userAlias);
                            break;
                        case 'email':
                            if (val.search(/^[^@]+@[^@.]+\.[^@]+$/i) != 0) return setError(field, localization_lng.incorrect);
                            break;
                        case 'num':
                            if (val.search(/^[\d\s]+$/) != 0) return setError(field, localization_lng.only_numbers);
                            break;
                        case 'summ':
                            if (val.search(/^[0-9\s]+(?:\.[0-9\s]{1,2})?$/) != 0) return setError(field, localization_lng.summ);
                            break;
                        case 'date':
                            if (val.search(/^([0-2]\d|3[01])\.(0\d|1[012])\.(\d{4})$/) != 0) return setError(field, localization_lng.date);
                            break;
                        case 'url':
                            if (val.search(/(^https?:\/\/)?(^@)?[^@]+\.[^@]{2,9}(\/|\?)/i) != 0) return setError(field, localization_lng.url);
                            break;
                        case 'urlmain':
                            if (val.search(/(^https?:\/\/)?(^@)?[^@]+\.[^@]{2,9}$/i) != 0) return setError(field, localization_lng.url);
                            break;
                        case 'price_bliz':
                            val = val.replace(/[^+\d]/g, '');
                            if (val < 1) return removeError($('input[name=price_reserv]'));
                            if (val.search(/^[0-9\s]+(?:\.[0-9]{1,2})?$/) != 0) return setError(field, localization_lng.summ);
                            if (val != 0 && val <= parseFloat($('input[name=price_start]').val().replace(/[^+\d]/g, ''))) return setError(field, localization_lng.price_bliz);
                            if (val != 0 && val <= parseFloat($('input[name=price_reserv]').val().replace(/[^+\d]/g, ''))) return setError(field, localization_lng.low_bliz);
                            else {
                                removeError($('input[name=price_reserv]'));
                                return true;
                            }
                        case 'price_reserv':
                            val = val.replace(/[^+\d]/g, '');
                            if (val < 1) return removeError($('input[name=price_bliz]'));
                            if (val.search(/^[0-9\s]+(?:\.[0-9]{1,2})?$/) != 0) return setError(field, localization_lng.summ);
                            if (val != 0 && val >= parseFloat($('input[name=price_bliz]').val().replace(/[^+\d]/g, '')) && parseFloat($('input[name=price_bliz]').val().replace(/[^+\d]/g, '')) != 0) return setError(field, localization_lng.high_reserv);
                            else {
                                removeError($('input[name=price_bliz]'));
                                return true;
                            }
                            break;
                        case 'phone':
                            //if(val.search(/^\+[\d]{1}\ \([\d]{2,3}\)\ [\d]{2,3}-[\d]{2,3}-[\d]{2,3}$/)!=0) return setError(field, localization_lng.phone);
                            if (val.search(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/) != 0) return setError(field, localization_lng.phone);
                            break;
                        case 'address_city':
                            if (val.length < 2) return setError(field, localization_lng.city_min_length);
                            var finded_in_datalist = false;
                            $('#region_city_list option').each(function () {
                                if (val == $(this).val()) finded_in_datalist = true;
                            });
                            if (!finded_in_datalist) return setError(field, localization_lng.city_incorrect_name);
                            let selRegion = $('select[name=address_region]').val();
                            if (selRegion == 0 || selRegion == '')
                                return setError(field, localization_lng.city_empty_region);
                            break;
                    }
                }
            }
            return true;
        };
        var validForm = function (form) {
            var valid = true;
            $(form).find('input, select, textarea').each(function (key, field) {
                if (!validField(field)) valid = false;
            });
            if (!valid) {
                var pos_top = $('input.error, textarea.error').eq(0).offset().top;
                $("html, body").stop().animate({ scrollTop: pos_top - $('header').outerHeight(true) - 60 }, 500);
            }
            return valid;
        };

        if ($(this).is('form')) {
            return validForm(this);
        } else {
            return validField(this);
        }
    }

    $('select[name=address_region]').change(function () {
        $('input[name="address_city"]').val(0);
        $('#address_city_text').val('');
        $('#region_city_list').html('<option value=""></option>');
        /*let regId = $(this).val();

        $('select[name=address_city]').html('<option value="0"></option>');

        if (regId != '' && regId != 0) {
            $.get('/cabinet',
                {ajax: 1, region_id: $(this).val()},
                function (data) {
                    let sCityList = '<option value="0"></option>';
                    for (let city of data) {
                        sCityList += `<option value="${city.id}">${city.title}</option>`
                    }
                    $('select[name=address_city]').html(sCityList);
                }, 'json');
        }*/
    });


    $('body').on('click', '.select2-selection.select2-selection--multiple', function () {
        console.log('here')
        //$(this).find('.city_choosing_label').remove()
        $('#region_city_list_select').attr("data-req", 'true');
        $('#region_city_list_select2').attr("data-req", 'true');
        $('.null_option').text('')
    })
    $("#region_city_list_select, #region_city_list_select2").select2({
        ajax: {
            url: "/cabinet?ajax=1&",
            dataType: 'json',
            data: function (params) {
                let region = $('select[name=address_region]').val();
                return {
                    search_text: params.term,
                    region_id: region,
                };
            },
            processResults: function (data) {
                return {
                    results: data,
                };
            },
            cache: true
        },
        templateResult: formatRepo,
        minimumInputLength: 1,
        maximumSelectionLength: 1
    });

    function formatRepo(city) {
        //console.log(city);
        let str = `<li class='city_option' value="${city.id}">${city.title}</li>`;
        $('.select2-results__options').append(str);
    }
    $('body').on('click', '.null_option', function () {
        $(this).prev().find('.select2-search__field').focus();
        $('#region_city_list_select').attr("data-req", 'true');
        $('#region_city_list_select2').attr("data-req", 'true');
        $(this).text('')
    });
    $('body').on('click', '.city_option', function (event) {
        $('input[name=address_city]').val(event.target.value);
        $('#region_city_list_select').parent().find('.null_option').text(event.target.innerText)
        $('#region_city_list_select').removeAttr("data-req");
        $('#region_city_list_select').prop('disabled', true);

        $('#region_city_list_select2').parent().find('.null_option').text(event.target.innerText)
        $('#region_city_list_select2').removeAttr("data-req");
        $('#region_city_list_select2').prop('disabled', true);

        setTimeout(() => $('#region_city_list_select').prop('disabled', false), 100) //$('#region_city_list_select').prop('disabled', false);
        if ($('.change_delivery.self_delivery').length) {
            if (parseInt(event.target.value) == parseInt($('.change_delivery.self_delivery').data('seller-city'))) {
                $('.change_delivery.self_delivery').prop('disabled', false);
            } else {
                $('.change_delivery.self_delivery').prop('disabled', true);
            }
        }

    });
    $('body').on('click', '.select2-selection.select2-selection--multiple', function () {
        console.log('here')
        //$(this).find('.city_choosing_label').remove()
        $('#region_city_list_select').attr("data-req", 'true');
        $('#region_city_list_select2').attr("data-req", 'true');
        $('.null_option').text('')
    })


    $('#address_city_text').autocomplete({
        minLength: 2,
        classes: {
            "ui-autocomplete": "region-city-list-autocomplete"
        },
        source: function (request, response) {
            let val = request.term;
            let selRegion = $('select[name=address_region]').val();

            $.get('/cabinet',
                { ajax: 1, region_id: selRegion, search_text: val },
                function (data) {
                    let str = '';

                    for (let city of data) {
                        str += `<option value="${city.title}">${city.title}</option>`
                    }

                    $('#region_city_list').html(str);

                    response($.map(data, function (city) {
                        return {
                            value: city.title,
                            city_id: city.id,
                        }
                    }));

                    if (data.length == 1) {
                        $('#address_city_text').validate();//browser autocomplite
                    }
                },
                'json'
            );
        },
        select: function (event, ui) {
            $('input[name=address_city]').val(ui.item.city_id);
        }
    });

    function check_order_delivery() {
        let region = $('select[name=address_region] option[value=' + $('select[name=address_region]').val() + ']').html();
        $('.delivery_item_1').each(function () {//самовывоз
            //console.log(region + '_' + $('#address_city_text').val(), $(this).closest('.content').data('addresscity'))
            if (region + '_' + $('#address_city_text').val() == $(this).closest('.content').data('addresscity')) {
                $(this).children('input').prop('disabled', false);
            } else {
                $(this).children('input').prop('disabled', true);
            }
        });
    }

    function calc_delivery() {
        $('.is_calc_delivery').each(function () {
            var obj = $(this);
            $.post('/order/calc_delivery',
                {
                    'seller': obj.find('.change_delivery').data('seller'),
                    'delivery': obj.find('.change_delivery').val(),
                    'address_region': $('select[name=address_region]').val(),
                    'address_index': $('input[name=address_index]').val(),
                    'address_city': $('input[name=address_city]').val(),
                    'address_street': $('input[name=address_street]').val()
                },
                function (data) {
                    let is_success = (data.status == 'success');
                    if (is_success) {
                        obj.find('span').html(data.price + ' <r style="font-family: rouble">e</r>');
                        obj.find('input').prop('disabled', false);
                    } else {
                        obj.find('span').html(data.errorMsg);
                        obj.find('input').prop('disabled', true);
                    }

                }, 'json')

            if ($(this).find('input').prop('checked')) {
                $(this).find('input').change();
            }
        });
    }

    calc_delivery();

    $('input[name=address_index], input[name=address_street]').change(function () {
        calc_delivery();
    })

    $('#address_city_text').change(function () {//browser autocomplite
        $('#address_city_text').autocomplete("search", $(this).val());
        check_order_delivery();
        calc_delivery();
    });

    $('#address_city_text').focus(function () {
        if ($('.region-city-list-autocomplete').css('display') != 'none') return;

        let self = this;

        let iCity = $('#region_city_list option').toArray().findIndex(function (element) {
            return element.value == self.value;
        });

        if (iCity == -1) {
            $('.region-city-list-autocomplete').show();
        }
    });

    /*$('#address_city_text').on('input', function () {
        let val = $(this).val();
        let obj = $(this);
        let selRegion = $('select[name=address_region]').val();
        let city_list = $('#region_city_list');

        if (val.length < 2) {
            city_list.html('<option value=""></option>');
            return;
        }

        let selCityOption = $(`option[value="${val}"]`, city_list);

       // console.log(selCityOption)
        if (selCityOption.length == 1) {
            $('input[name=address_city]').val(selCityOption.data('id'));
            return;
        }

        $.get('/cabinet',
            {ajax: 1, region_id: selRegion, search_text: val},
            function (data) {
                let sCityList = '';//'<option value=""></option>';
                for (let city of data) {
                    sCityList += `<option value="${city.title}" data-id="${city.id}">${city.title}</option>`
                }
                $('#region_city_list').html(sCityList);
            }, 'json');
    });

    $('#address_city_text').on('change', function () {
         let val = $(this).val();
         let city_list = $('#region_city_list');
         let selCityOption = $(`option[value="${val}"]`, city_list);
         if (selCityOption.length == 1) {
            $('input[name=address_city]').val(selCityOption.data('id'));
        }
    });*/

    $('.modal .close').click(function (event) {
        event.preventDefault();
        $(this).parents('.modal').fadeOut();
    });

    $('.rev_spoiler').click(function () {
        $(".rev_spoiler + .review_cnt").slideToggle(100);
        $(this).toggleClass('open');
    });
    $('.subs_spoiler').click(function () {
        $(".subs_spoiler_block").slideToggle(100);
        $(this).toggleClass('open');
    });
    $('.block_spoiler').click(function () {
        $(".block_spoiler_block").slideToggle(100);
        $(this).toggleClass('open');
    });

    $('#yandex_money_phone').click(function () {
        $("#yandex_money_phone + .payForm__eachInput").slideToggle(100);
        if (!$(this).hasClass("open")) $("#SetYDShow").val(1);
        $(this).toggleClass('open');
        $('#yandex_money_num').toggleClass('open');
        $(" #yandex_money_num + .payForm__eachInput").slideToggle(100);
    });
    $('#yandex_money_num').click(function () {
        $(" #yandex_money_num + .payForm__eachInput").slideToggle(100);
        if (!$(this).hasClass("open")) $("#SetYDShow").val(2);
        $(this).toggleClass('open');
        $('#yandex_money_phone').toggleClass('open');
        $(" #yandex_money_phone + .payForm__eachInput").slideToggle(100);
    });

    $(".payForm__radio_group.delivery_item_1").click(function () {
        //let tar = $(e.target);
        let atttr = $('#rb_d_31_1').attr("disabled");
        if (typeof atttr !== typeof undefined && atttr !== false) {
            $('#rb_d_31_1').prop('checked', 'false');
        }
        //if (tar.is( "label.rb::after" )) $('#rb_d_31_1').prop('checked','false');//!$(this).find('input').prop('checked')
    })

    if ($(".right_block.your_order").length) {
        var t = $(".right_block.your_order").offset().top;
        var order_block_width = $(".right_block.your_order.no_overflow").width();
        fixed_order_table();
        $(window).resize(function () {
            fixed_order_table()
        });
        $(window).scroll(function () {
            fixed_order_table()
        })
    }

    function fixed_order_table() {
        if ($(window).width() < 993) {
            $(".right_block.your_order").removeClass("fixed");
            //$(".right_block.your_order").css("width", '');
            return
        }
        if ($(window).height() < $(".right_block.your_order").height() + 220) {
            $(".right_block.your_order").removeClass("fixed");
            return
        }
        if (t > window.pageYOffset + 110) {
            $(".right_block.your_order").removeClass("fixed");
            return
        }
        $(".right_block.your_order").addClass("fixed");
        $(".right_block.your_order").css("width", order_block_width + 'px');

        //console.log(`windowYOffset: ${window.pageYOffset}, t: ${t}, Высота грэй бг: `, $(".top_line_breadcrumbs + .gray_bg").height(), 'window height: ' , $(window).height());
        //if (window.pageYOffset > t + $(".top_line_breadcrumbs + .gray_bg").height() - $(window).height() + ($(window).height() - 110 - $(".catalog_item_page_right").height())) {
        if (window.pageYOffset > 187 + $(".top_line_breadcrumbs + .gray_bg").height() - (t + $(".right_block.your_order").height())) {
            $(".right_block.your_order").addClass("end")
        } else {
            $(".right_block.your_order").removeClass("end")
        }
    }

    function allow_vk_mes() {
        if ($(window).width() <= 768 && $('#span_vk_send_message').length != 0 && $('#span_vk_send_message').html().length != 0) {
            $('.mobile_vk_allow').html($('#span_vk_send_message').html())
            $('#span_vk_send_message').html('')
        }
    }

    $(window).resize(function () {
        allow_vk_mes()
    });


    try {
        CardInfo.setDefaultOptions({
            banksLogosPath: '/common/htdocs/images/banks-logos/',
            brandsLogosPath: '/common/htdocs/images/brands-logos/'
        })

        $('#cart_number').on('keyup paste', function () {
            var $front = $('#front_of_card')
            var $bankLink = $('#bank-link')
            var $brandLogo = $('#brand-logo')
            var $number = $('#cart_number')
            var $code = $('#code')
            // var $instance = $('#instance')
            var cardInfo = new CardInfo($number.val().replace(/[_\W]+/g, ""))
            if (cardInfo.bankUrl) {
                $bankLink
                    .attr('href', cardInfo.bankUrl)
                    .css('backgroundImage', 'url("' + cardInfo.bankLogo + '")')
                    .show()
            } else {
                $bankLink.hide()
            }
            //$('input[name=cart_number]').mask(cardInfo.numberMask.replace(/[0/W]/g, "#"), { autoclear: false});
            $front
                .css('background', cardInfo.backgroundGradient)
                .css('color', cardInfo.textColor)
            $code.attr('placeholder', cardInfo.codeName ? cardInfo.codeName : '')
            // $number.mask(cardInfo.numberMask)
            if (cardInfo.brandLogo) {
                $brandLogo
                    .attr('src', cardInfo.brandLogo)
                    .attr('alt', cardInfo.brandName)
                    .show()
            } else {
                $brandLogo.hide()
            }

        })
    } catch (e) {
        console.log('CardInfo not found', e)
    }


})(jQuery);


// Generated by CoffeeScript 1.9.2

/**
@license Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
 */

(function () {
    var $, win;

    $ = this.jQuery || window.jQuery;

    win = $(window);

    $.fn.stick_in_parent = function (opts) {
        var doc, elm, enable_bottoming, fn, i, inner_scrolling, len, manual_spacer, offset_top, parent_selector, recalc_every, sticky_class;
        if (opts == null) {
            opts = {};
        }
        sticky_class = opts.sticky_class, inner_scrolling = opts.inner_scrolling, recalc_every = opts.recalc_every, parent_selector = opts.parent, offset_top = opts.offset_top, manual_spacer = opts.spacer, enable_bottoming = opts.bottoming;
        if (offset_top == null) {
            offset_top = 0;
        }
        if (parent_selector == null) {
            parent_selector = void 0;
        }
        if (inner_scrolling == null) {
            inner_scrolling = true;
        }
        if (sticky_class == null) {
            sticky_class = "is_stuck";
        }
        doc = $(document);
        if (enable_bottoming == null) {
            enable_bottoming = true;
        }
        fn = function (elm, padding_bottom, parent_top, parent_height, top, height, el_float, detached) {
            var bottomed, detach, fixed, last_pos, last_scroll_height, offset, parent, recalc, recalc_and_tick, recalc_counter, spacer, tick;
            if (elm.data("sticky_kit")) {
                return;
            }
            elm.data("sticky_kit", true);
            last_scroll_height = doc.height();
            parent = elm.parent();
            if (parent_selector != null) {
                parent = parent.closest(parent_selector);
            }
            if (!parent.length) {
                throw "failed to find stick parent";
            }
            fixed = false;
            bottomed = false;
            spacer = manual_spacer != null ? manual_spacer && elm.closest(manual_spacer) : $("<div />");
            if (spacer) {
                spacer.css('position', elm.css('position'));
            }
            recalc = function () {
                var border_top, padding_top, restore;
                if (detached) {
                    return;
                }
                last_scroll_height = doc.height();
                border_top = parseInt(parent.css("border-top-width"), 10);
                padding_top = parseInt(parent.css("padding-top"), 10);
                padding_bottom = parseInt(parent.css("padding-bottom"), 10);
                parent_top = parent.offset().top + border_top + padding_top;
                parent_height = parent.height();
                if (fixed) {
                    fixed = false;
                    bottomed = false;
                    if (manual_spacer == null) {
                        elm.insertAfter(spacer);
                        spacer.detach();
                    }
                    elm.css({
                        position: "",
                        top: "",
                        width: "",
                        bottom: ""
                    }).removeClass(sticky_class);
                    restore = true;
                }
                top = elm.offset().top - (parseInt(elm.css("margin-top"), 10) || 0) - offset_top;
                height = elm.outerHeight(true);
                el_float = elm.css("float");
                if (spacer) {
                    spacer.css({
                        width: elm.outerWidth(true),
                        height: height,
                        display: elm.css("display"),
                        "vertical-align": elm.css("vertical-align"),
                        "float": el_float
                    });
                }
                if (restore) {
                    return tick();
                }
            };
            recalc();
            if (height === parent_height) {
                return;
            }
            last_pos = void 0;
            offset = offset_top;
            recalc_counter = recalc_every;
            tick = function () {
                var css, delta, recalced, scroll, will_bottom, win_height;
                if (detached) {
                    return;
                }
                recalced = false;
                if (recalc_counter != null) {
                    recalc_counter -= 1;
                    if (recalc_counter <= 0) {
                        recalc_counter = recalc_every;
                        recalc();
                        recalced = true;
                    }
                }
                if (!recalced && doc.height() !== last_scroll_height) {
                    recalc();
                    recalced = true;
                }
                scroll = win.scrollTop();
                if (last_pos != null) {
                    delta = scroll - last_pos;
                }
                last_pos = scroll;
                if (fixed) {
                    if (enable_bottoming) {
                        will_bottom = scroll + height + offset > parent_height + parent_top;
                        if (bottomed && !will_bottom) {
                            bottomed = false;
                            elm.css({
                                position: "fixed",
                                bottom: "",
                                top: offset
                            }).trigger("sticky_kit:unbottom");
                        }
                    }
                    if (scroll < top) {
                        fixed = false;
                        offset = offset_top;
                        if (manual_spacer == null) {
                            if (el_float === "left" || el_float === "right") {
                                elm.insertAfter(spacer);
                            }
                            spacer.detach();
                        }
                        css = {
                            position: "",
                            width: "",
                            top: ""
                        };
                        elm.css(css).removeClass(sticky_class).trigger("sticky_kit:unstick");
                    }
                    if (inner_scrolling) {
                        win_height = win.height();
                        if (height + offset_top > win_height) {
                            if (!bottomed) {
                                offset -= delta;
                                offset = Math.max(win_height - height, offset);
                                offset = Math.min(offset_top, offset);
                                if (fixed) {
                                    elm.css({
                                        top: offset + "px"
                                    });
                                }
                            }
                        }
                    }
                } else {
                    if (scroll > top) {
                        fixed = true;
                        css = {
                            position: "fixed",
                            top: offset
                        };
                        css.width = elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px";
                        elm.css(css).addClass(sticky_class);
                        if (manual_spacer == null) {
                            elm.after(spacer);
                            if (el_float === "left" || el_float === "right") {
                                spacer.append(elm);
                            }
                        }
                        elm.trigger("sticky_kit:stick");
                    }
                }
                if (fixed && enable_bottoming) {
                    if (will_bottom == null) {
                        will_bottom = scroll + height + offset > parent_height + parent_top;
                    }
                    if (!bottomed && will_bottom) {
                        bottomed = true;
                        if (parent.css("position") === "static") {
                            parent.css({
                                position: "relative"
                            });
                        }
                        return elm.css({
                            position: "absolute",
                            bottom: padding_bottom,
                            top: "auto"
                        }).trigger("sticky_kit:bottom");
                    }
                }
            };
            recalc_and_tick = function () {
                recalc();
                return tick();
            };
            detach = function () {
                detached = true;
                win.off("touchmove", tick);
                win.off("scroll", tick);
                win.off("resize", recalc_and_tick);
                $(document.body).off("sticky_kit:recalc", recalc_and_tick);
                elm.off("sticky_kit:detach", detach);
                elm.removeData("sticky_kit");
                elm.css({
                    position: "",
                    bottom: "",
                    top: "",
                    width: ""
                });
                parent.position("position", "");
                if (fixed) {
                    if (manual_spacer == null) {
                        if (el_float === "left" || el_float === "right") {
                            elm.insertAfter(spacer);
                        }
                        spacer.remove();
                    }
                    return elm.removeClass(sticky_class);
                }
            };
            win.on("touchmove", tick);
            win.on("scroll", tick);
            win.on("resize", recalc_and_tick);
            $(document.body).on("sticky_kit:recalc", recalc_and_tick);
            elm.on("sticky_kit:detach", detach);
            return setTimeout(tick, 0);
        };
        for (i = 0, len = this.length; i < len; i++) {
            elm = this[i];
            fn($(elm));
        }
        return this;
    };

}).call(this);

