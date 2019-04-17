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
use craft\base\Plugin as BasePlugin;
use craft\redactor\events\RegisterPluginPathsEvent;
use craft\redactor\Field as RichText;
use craft\web\View;
use venveo\redactorsplit\services\RedactorSplit;
use yii\base\Event;

/**
 * Class RedactorSplit
 *
 * @property RedactorSplit service
 * @author    Venveo
 * @package   RedactorSplit
 * @since     1.0.0
 *
 */
class Plugin extends BasePlugin
{
    /**
     * @var Plugin
     */
    public static $plugin;

    function __construct($id, $parent = null, array $config = [])
    {
        parent::__construct($id, $parent, $config);

        $this->setComponents(['service' => RedactorSplit::class]);
    }

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
                function(RegisterPluginPathsEvent $event) {
                    $src = Craft::getAlias('@venveo/redactorsplit')
                        .DIRECTORY_SEPARATOR
                        .'resources';
                    $event->paths[] = $src;
                    Craft::$app->getView()->registerAssetBundle(RedactorSplitAsset::class);
                    Craft::$app->getView()->registerJs(sprintf('var redactorSplitMapping = %s;', \GuzzleHttp\json_encode($this->service->getMappings())), View::POS_HEAD);

                }
            );
        }
    }

}
