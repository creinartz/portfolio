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
            this.model.set('state', $(e.currentTarget).data('state'));
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

        , render: function()
        {
            var _$node = $(this.options.tileTemplate({
                href: '#'
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

    var ImageView = TileView.extend({
        template: _.template('<img src="<%= url %>" alt="<%= title %>" title="<%= description %>" />')

        , events: {
            'click .tile': 'onClick'
        }
        
        , initialize: function(options)
        {
            this.options = _.extend({}, options);
            this.render();
        }

        , onClick: function()
        {
        }
    });

    var ArticleView = TileView.extend({
        template: _.template('<h2><%= title %></h2><p><%= text %></p>')

        , events: {
            'click .tile': 'onClick'
        }

        , initialize: function(options)
        {
            this.options = _.extend({}, options);
            this.render();
        }

        , onClick: function()
        {
        }
    });

    /*** history handling ***/
    function pushToHistory(state)
    {
        if(pushStateSupported)
        {
            if('overview' === state)
            {
                history.pushState(state, '', '/');
            }
            else if('blog' === state)
            {
                // jvt: @todo
            }
            else
            {
                history.pushState(state, '', '/' + state);
            }
        }
    }

    function onPopHistory(e)
    {
        if(e.state)
        {
            state.set('state', e.state);
        }
    }

    /*** state handling ***/
    function onStateChange(model, state)
    {
        //console.debug('onStateChange', arguments);
        pushToHistory(state);

        var _tiles = $content.find('.tile');
        if(_tiles.length > 0)
        {
            _tiles.fadeOut(300, function()
            {
                destroyViews();
                $content.empty();
                displayContent(state);
            });
        }
        else
        {
            displayContent(state);
        }
    }

    function displayContent(state)
    {
        switch(state)
        {
            case 'portrait':
            case 'studio':
            case 'outdoor':
            case 'event':
                showImageCategory(state);
                break;

            case 'blog':
                showArticles();
                break;

            default:
                showOverview();
        }
    }

    function destroyViews()
    {
        _.each(views, function(view)
        {
            view.destroy();
        });

        views = [];
    }

    function showArticles()
    {
        articles.each(function(model)
        {
            addView(model, ArticleView);
        });
    }

    function showImageCategory(category)
    {
        var _filteredImages = images.where({ category: category });
        _.each(_filteredImages, function(model) {
            addView(model, ImageView);
        });
    }

    function showOverview()
    {
        images.reset(images.shuffle(), { silent: true });
        images.each(function(model) {
            addView(model, ImageView);
        });
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
    var state = new Backbone.Model
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
        images.add(data.images);
        articles.add(data.articles);

        $content  = $('#content');

        new MenuView({
            el: '#links'
            , model: state
        });

        if(pushStateSupported)
        {
            global.onpopstate = onPopHistory;
        }

        state.on('change:state', onStateChange);
        state.set('state', (data.state || 'overview'));

        $('#janvt').on('click', function(e)
        {
            state.set('state', 'overview');
            e.preventDefault();
        });
    });
}(window, jQuery, _, Backbone));