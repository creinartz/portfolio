;(function(global, $, _, Backbone)
{
    /*** models ***/
    var StateModel = Backbone.Model;
    var ImageModel = Backbone.Model.extend({
        defaults: {
            url: ''
            , thumbUrl: ''
            , category: ''
            , title: ''
            , description: ''
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

    /*** state handling ***/
    function onStateChange(model, state)
    {
        destroyViews();
        $content.empty(); // @todo views should remove themselves

        switch(state)
        {
            case 'portrait':
            case 'studio':
            case 'outdoor':
            case 'event':
                showImageCategory(state);

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

    function showImageCategory(category)
    {
        var _filteredImages = images.where({ category: category })
        _.each(_filteredImages, function(model) {
            views.push(new ImageView({
                model: model
                , $appendTo: $content
                , tileTemplate: tileTemplate
            }));
        });
    }

    function showOverview()
    {
        images.each(function(model) {
            views.push(new ImageView({
                model: model
                , $appendTo: $content
                , tileTemplate: tileTemplate
            }));
        });
    }
    
    /*** ***/
    var state = new StateModel({ state: 'overview' })
        , tileTemplate = _.template('<a class="tile" href="<%= href %>"><div><%= content %></div></a>')
        , images = new (Backbone.Collection.extend({ model: ImageModel }))
        , $content
        , views = []
    ;

    function init()
    {
        var data = global.lovelyData;
        if(data.images)
        {
            images.add(data.images);
        }

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