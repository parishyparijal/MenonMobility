<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Jobs\SendSavedSearchAlerts;
use Illuminate\Console\Command;

class SendSavedSearchAlertsCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'searches:notify {--frequency=daily : The notification frequency to process (daily or weekly)}';

    /**
     * The console command description.
     */
    protected $description = 'Dispatch saved-search alert notifications for the specified frequency';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $frequency = $this->option('frequency');

        if (! in_array($frequency, ['daily', 'weekly'], true)) {
            $this->error("Invalid frequency \"{$frequency}\". Must be \"daily\" or \"weekly\".");

            return self::FAILURE;
        }

        SendSavedSearchAlerts::dispatch($frequency);

        $this->info("Dispatched saved-search alerts job for frequency: {$frequency}");

        return self::SUCCESS;
    }
}
