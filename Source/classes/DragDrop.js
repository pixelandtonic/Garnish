/**
 * Drag-and-drop class
 *
 * Builds on the Drag class by allowing you to set up "drop targets"
 * which the dragged elemements can be dropped onto.
 */
Garnish.DragDrop = Garnish.Drag.extend({

	$dropTargets: null,
	$activeDropTarget: null,

	/**
	 * Constructor
	 */
	init: function(settings)
	{
		settings = $.extend({}, Garnish.DragDrop.defaults, settings);
		this.base(settings);
	},

	/**
	 * On Drag Start
	 */
	onDragStart: function()
	{
		if (this.settings.dropTargets)
		{
			if (typeof this.settings.dropTargets == 'function')
			{
				this.$dropTargets = $(this.settings.dropTargets());
			}
			else
			{
				this.$dropTargets = $(this.settings.dropTargets);
			}

			// ignore if an empty array
			if (!this.$dropTargets.length)
			{
				this.$dropTargets = null;
			}
		}

		this.$activeDropTarget = null;

		this.base();
	},

	/**
	 * On Drag
	 */
	onDrag: function()
	{
		if (this.$dropTargets)
		{
			this.onDrag._activeDropTarget = null;

			// is the cursor over any of the drop target?
			for (this.onDrag._i = 0; this.onDrag._i < this.$dropTargets.length; this.onDrag._i++)
			{
				this.onDrag._elem = this.$dropTargets[this.onDrag._i];

				if (Garnish.hitTest(this.mouseX, this.mouseY, this.onDrag._elem))
				{
					this.onDrag._activeDropTarget = this.onDrag._elem;
					break;
				}
			}

			// has the drop target changed?
			if (!this.$activeDropTarget || this.onDrag._activeDropTarget != this.$activeDropTarget[0])
			{
				// was there a previous one?
				if (this.$activeDropTarget)
				{
					this.$activeDropTarget.removeClass(this.settings.activeDropTargetClass);
				}

				// remember the new drop target
				this.$activeDropTarget = $(this.onDrag._activeDropTarget);

				// is there a new one?
				if (this.$activeDropTarget)
				{
					this.$activeDropTarget.addClass(this.settings.activeDropTargetClass);
				}

				this.settings.onDropTargetChange(this.$activeDropTarget);
			}
		}

		this.base();
	},

	/**
	 * On Drag Stop
	 */
	onDragStop: function()
	{
		if (this.$dropTargets && this.$activeDropTarget)
		{
			this.$activeDropTarget.removeClass(this.settings.activeDropTargetClass);
		}

		this.base();
	},

	/**
	 * Fade Out Helpers
	 */
	fadeOutHelpers: function()
	{
		for (var i = 0; i < this.helpers.length; i++)
		{
			(function($draggeeHelper)
			{
				$draggeeHelper.fadeOut('fast', function() {
					$draggeeHelper.remove();
				});
			})(this.helpers[i]);
		}
	}
},
{
	defaults: {
		dropTargets: null,
		onDropTargetChange: $.noop,
		activeDropTargetClass: 'active'
	}
});
