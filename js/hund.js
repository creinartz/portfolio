;(function(global, $, _, Backbone)
{
    /*** models ***/
    var ImageModel = Backbone.Model.extend({
        defaults: {
            url: ''
            , thumbUrl: ''
            , category: ''
            , title: ''
            , description: ''
            , cssClass: 'image'
        }

        , initialize: function()
        {
            this.set('cssClass', this.get('cssClass') + ' ' + this.get('category'));
        }
    });

    var ArticleModel = Backbone.Model.extend({
        defaults: {
            title: ''
            , text: ''
            , cssClass: 'article'
        }
    });
    
    /*** views ***/
    var MenuView = Backbone.View.extend({
        events: {
            'click a': 'onClick'
        }

        , initialize: function()
        {
            this.listenTo(this.model, 'change:state', this.onChangeState);
        }

        , onChangeState: function(model, state)
        {
            this.$('a').removeClass('current');
            this.$('.' + state).addClass('current');
        }
        
        , onClick: function(e)
        {
            this.model.set({
                state: $(e.currentTarget).data('state')
                , url: '' // jvt: and reset url
            });
            e.preventDefault();
        }
    });

    // content type views
    var TileView = Backbone.View.extend({
        destroy: function()
        {
            this.unbind();
            this.remove();
        }

        , render: function(href)
        {
            var _$node = $(this.options.tileTemplate({
                href: (href || '#')
                , content: this.template(this.model.toJSON())
                , cssClass: this.model.get('cssClass')
            }));

            this.options.$appendTo.append(_$node);

            this.setElement(_$node);
            this.$el.fadeTo(900, 0.9, function()
            {
                _$node.removeClass('hidden');
                _$node.removeAttr('style');
            });
        }
    });

    var ImageTileView = TileView.extend({
        template: _.template('<img src="<%= thumbUrl %>" alt="<%= title %>" title="<%= description %>" />')
        , lightboxTemplate: _.template('<img src="<%= url %>" alt="<%= title %>" title="<%= description %>" />')

        , events: {
            'click img': 'onClick'
        }
        
        , initialize: function(options)
        {
            this.options = _.extend({}, options);
            this.render();
        }

        , onClick: function()
        {
            var _html = this.lightboxTemplate(this.model.toJSON());
            $(_html).lightbox_me({
                centered: true
                , destroyOnClose: true
                , lightboxSpeed: 'slow'
                , overlaySpeed: 600
                , overlayCSS: {
                    background: 'black'
                    , opacity: .8
                }
            });
        }
    });

    var ArticleTileView = TileView.extend({
        template: _.template('<h4><%= title %></h4><p><%= text %></p>')

        , initialize: function(options)
        {
            this.options = _.extend({}, options);
            this.render(this.model.get('url'));
        }
    });

    /*var ArticleView = Backbone.View.extend({
        initialize: function(options)
        {
            this.options = _.extend({}, options);
            this.load();
            $content.addClass('article');
        }

        , load: function()
        {
            // jvt:
            $.ajax({
                url: this.model.get('htmlSrc')
                , success: function(html)
                {
                    //console.debug('load success', arguments);
                    this.$el.html(html);
                }
            });
        }

        , destroy: function()
        {
            $content.removeClass('article');
            this.unbind();
            this.$el.empty();
        }
    });*/

    var ContactView = Backbone.View.extend({
        initialize: function(options)
        {
            this.options = _.extend({}, options);
            this.$el.append(this.options.html);
        }

        , destroy: function()
        {
            this.unbind();
            this.$el.empty();
        }
    });

    /*** history handling ***/
    function pushToHistory(state, url)
    {
        if(pushStateSupported)
        {
            var _url = '/' + state
                , _state = state
            ;

            if('overview' === state)
            {
                _url = '/';
            }
            else if('blog' === state)
            {
                _url = (url || state);
                _state = _url;
                _url = '/' + _url;
            }

            //console.debug('push', _state, _url);
            history.pushState(_state, '', _url);
        }
    }

    function onPopHistory(e)
    {
        if(e.state)
        {
            switch(e.state)
            {
                case 'portrait':
                case 'studio':
                case 'outdoor':
                case 'event':
                case 'blog':
                case 'contact':
                    State.set('state', e.state);
                    break;

                default: // jvt: most likely a blog URL
                    State.set('url', e.state);
                    //showArticle(s.state);
                    break;
            }
        }
    }

    /*** state handling ***/
    function onStateChange(model, state, options)
    {
        //console.debug('onStateChange', arguments);
        options = options || {};
        pushToHistory(state, State.get('url'));

        var _tiles = $content.find('.tile');
        if(_tiles.length > 0)
        {
            _tiles.fadeOut(300, function()
            {
                destroyViews();
                $content.empty();
                displayContent(state, options);
            });
        }
        else
        {
            if(!options.pageLoad && $content.html().length > 0)
            {
                destroyViews();
                $content.empty();
            }

            displayContent(state, options);
        }
    }

    function onUrlChange(model, url, options)
    {
        options = options || {};
        //console.debug('onUrlChange', arguments);
        if('blog' === State.get('state'))
        {
            if(_.isEmpty(url) && !options.pageLoad)
            {
                // jvt: explicitely call change state event
                onStateChange(null, 'blog');
            }
            /*else // jvt: @todo
            {
                showArticle(url);
            }*/
        }
    }

    function displayContent(state, options)
    {
        switch(state)
        {
            case 'portrait':
            case 'studio':
            case 'outdoor':
            case 'event':
                showImageCategory(state, options);
                break;

            case 'blog':
                showArticles(options);
                break;

            case 'contact':
                showContact(options);
                break;

            default:
                showOverview(options);
        }
    }

    function setContentClasses(newClasses)
    {
        $content.removeAttr('class');
        $content.addClass(newClasses);
    }

    function destroyViews()
    {
        _.each(views, function(view)
        {
            view.destroy();
        });

        views = [];
    }

    function showContact(options)
    {
        if(!options.pageLoad)
        {
            setContentClasses('contact');
            views.push(new ContactView({
                el: $content
                , html: contactHtml
            }));
        }
    }

    // jvt: @todo (only on page load currently...)
    /*function showArticle(url)
    {
        var _article = articles.findWhere({ url: url });
        if('undefined' != typeof _article)
        {
            views.push(new (ArticleView({
                el: $content
                , model: _article
            })));
        }
        else
        {
            // jvt: invalid article URL, just reload page
            // jvt: @todo
            //console.error('invalid url: ' + url);
            //location.reload(true);
        }
    }*/

    function showArticles(options)
    {
        if((options.pageLoad && !State.get('url')) || !options.pageLoad)
        {
            setContentClasses('blog');
            articles.each(function(model)
            {
                addView(model, ArticleTileView);
            });
        }
    }

    function showImageCategory(category)
    {
        setContentClasses(category);
        var _filteredImages = images.where({ category: category });
        _.each(_filteredImages, function(model) {
            addView(model, ImageTileView);
        });
    }

    function showOverview()
    {
        setContentClasses('overview');
        images.reset(images.shuffle(), { silent: true });
        var i, n, ip = 0, ap = 0;
        for(i = 0, n = 20; i < n; i++)
        {
            // jvt: articles at 1 & 4 @todo random?
            if((i === 1 || i === 4) && ap < (articles.length))
            {
                addView(articles.at(ap), ArticleTileView);
                ap++;
            }
            else
            {
                addView(images.at(ip), ImageTileView);
                ip++;
            }
        }
        /*images.each(function(model) {
            addView(model, ImageTileView);
        });*/
    }

    function addView(model, View)
    {
        views.push(new View({
            model: model
            , $appendTo: $content
            , tileTemplate: tileTemplate
        }));
    }
    
    /*** ***/
    var State = new Backbone.Model
        , contactHtml
        , tileTemplate = _.template('<a class="tile hidden <%= cssClass %>" href="<%= href %>"><div><%= content %></div></a>')
        , images = new (Backbone.Collection.extend({ model: ImageModel }))
        , articles = new (Backbone.Collection.extend({ model: ArticleModel }))
        , $content
        , views = []
        , pushStateSupported = !!(global.history && history.pushState)
    ;

    // jvt: run init on document ready
    $(function()
    {
        var data = global.lovelyData;
        //console.debug('data', data);
        images.add(data.images);
        articles.add(data.articles);
        contactHtml = data.contactHtml

        $content  = $('#content');

        new MenuView({
            el: '#links'
            , model: State
        });

        if(pushStateSupported)
        {
            global.onpopstate = onPopHistory;
        }

        State.on('change:state', onStateChange);
        State.on('change:url', onUrlChange);
        State.set({
                state:(data.state || 'overview')
                , url: data.url
            }
            , { pageLoad: true }
        );

        $('#janvt').on('click', function(e)
        {
            State.set('state', 'overview');
            e.preventDefault();
        });
    });
}(window, jQuery, _, Backbone));