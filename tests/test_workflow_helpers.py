import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'src'))
from workflow_helpers import verify_webhook, wait_for_job

class HelpersTest(unittest.TestCase):
    def test_signature_vector(self):
        raw=b'{"id":"evt_1"}'
        sig='sha256=9a87814c353fb728b2a0563fc1b83be3f731d47017373fd4cf10c07c21eccf6f'
        self.assertTrue(verify_webhook(raw,'1000',sig,'secret',now_seconds=1000))
        self.assertFalse(verify_webhook(raw,'1000',sig,'secret',now_seconds=1400))
        self.assertFalse(verify_webhook(b'{}','1000',sig,'secret',now_seconds=1000))
        self.assertFalse(verify_webhook(raw,'1000',sig,'wrong',now_seconds=1000))
    def test_poll_success(self):
        states=iter(['pending','running','succeeded'])
        def read(identifier,remaining):
            self.assertGreater(remaining,0)
            return {'job_id':identifier,'status':next(states)}
        self.assertEqual(wait_for_job('job',read,interval_seconds=0)['status'],'succeeded')
    def test_failed_job_and_wrong_id(self):
        with self.assertRaises(RuntimeError):wait_for_job('job',lambda *_:{'job_id':'job','status':'failed'})
        with self.assertRaises(ValueError):wait_for_job('job',lambda *_:{'job_id':'other','status':'succeeded'})

if __name__=='__main__':unittest.main()
