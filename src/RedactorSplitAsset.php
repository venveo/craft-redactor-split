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


use craft\redactor\assets\redactor\RedactorAsset;
use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use craft\web\assets\matrix\MatrixAsset;

/**
 * Class RedactorSplit
 *
 * @author    Venveo
 * @package   RedactorSplit
 * @since     1.0.0
 *
 */
class RedactorSplitAsset extends AssetBundle
{
    public function init()
    {
        $this->sourcePath = '@venveo/redactorsplit/resources';
        $this->depends = [
            CpAsset::class,
            RedactorAsset::class,
            MatrixAsset::class
        ];
        $this->js = [
            'redactor-split.js'
        ];
        parent::init();
    }

}
