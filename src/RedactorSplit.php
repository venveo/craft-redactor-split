<?php
/**
 * Redactor Split plugin for Craft CMS 3.x
 *
 * Split a matrix block
 *
 * @link      https://www.venveo.com
 * @copyright Copyright (c) 2019 Venveo
 */

namespace venveo\redactorsplit;


use Craft;
use craft\base\Plugin;
use craft\redactor\events\RegisterPluginPathsEvent;
use craft\redactor\Field as RichText;
use yii\base\Event;

/**
 * Class RedactorSplit
 *
 * @author    Venveo
 * @package   RedactorSplit
 * @since     1.0.0
 *
 */
class RedactorSplit extends Plugin
{
    // Static Properties
    // =========================================================================

    /**
     * @var RedactorSplit
     */
    public static $plugin;

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();
        self::$plugin = $this;

        if (Craft::$app->getPlugins()->getPlugin('redactor')) {
            Event::on(
                RichText::class,
                RichText::EVENT_REGISTER_PLUGIN_PATHS,
                function (RegisterPluginPathsEvent $event) {
                    $src            = Craft::getAlias('@venveo/redactorsplit')
                        . DIRECTORY_SEPARATOR
                        . 'resources';
                    $event->paths[] = $src;
                    Craft::$app->getView()->registerAssetBundle(RedactorSplitAsset::class);
                }
            );
        }
    }

    // Protected Methods
    // =========================================================================

}
