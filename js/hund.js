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
            this.options.$appendTo.append(this.options.tileTemplate({
                href: '#'
                , content: this.template(this.model.toJSON())
                , cssClass: this.model.get('cssClass')
            }));
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

    /*** state handling ***/
    function onStateChange(model, state)
    {
        destroyViews();
        $content.empty();

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
    var state = new Backbone.Model({ state: 'overview' })
        , tileTemplate = _.template('<a class="tile <%= cssClass %>" href="<%= href %>"><div><%= content %></div></a>')
        , images = new (Backbone.Collection.extend({ model: ImageModel }))
        , articles = new (Backbone.Collection.extend({ model: ArticleModel }))
        , $content
        , views = []
    ;

    function init()
    {
        var data = global.lovelyData;
        images.add(data.images);
        articles.add(data.articles);

        $content  = $('#content');

        new MenuView({
            el: '#links'
            , model: state
        });

        $('#janvt').on('click', function(e)
        {
            state.set('state', 'overview');
            e.preventDefault();
        });

        // jvt: display initial content
        onStateChange(null, state.get('state'));
        state.on('change:state', onStateChange);
    }
    
    // jvt: run init on document ready
    $(init);
}(window, jQuery, _, Backbone));